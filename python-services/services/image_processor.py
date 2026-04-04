# python-services/services/image_processor.py
from PIL import Image, ImageEnhance
import io
import requests
import os
import hashlib
from datetime import datetime
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UPLOAD_DIR = 'uploads'
THUMBNAIL_SIZES = {
    'thumbnail': (200, 200),
    'small': (400, 400),
    'medium': (800, 800),
    'large': (1200, 1200)
}


def ensure_upload_dir():
    """Create upload directory if it doesn't exist."""
    Path(UPLOAD_DIR).mkdir(exist_ok=True)
    for size in THUMBNAIL_SIZES.keys():
        Path(f"{UPLOAD_DIR}/{size}").mkdir(exist_ok=True)


def get_file_hash(content):
    """Generate MD5 hash for file content to avoid duplicates."""
    return hashlib.md5(content).hexdigest()


def _normalize_pixel(p):
    """
    Normalize a pixel to an (r, g, b) tuple regardless of image mode.
    Fix: handles grayscale images where pixels are plain ints, not tuples.
    """
    if isinstance(p, (int, float)):
        v = int(p)
        return v, v, v
    rgb = tuple(p)
    if len(rgb) >= 3:
        return rgb[0], rgb[1], rgb[2]
    v = rgb[0]
    return v, v, v


def optimize_product_image(image_data, filename=None):
    """
    Optimize a product image — resize, compress, save in multiple sizes.
    Args:
        image_data: bytes or a URL string
        filename: optional custom filename
    Returns:
        dict with paths to different sizes
    """
    try:
        ensure_upload_dir()

        if isinstance(image_data, str):
            response = requests.get(image_data, timeout=10)
            response.raise_for_status()
            content = response.content
        else:
            content = image_data

        if not filename:
            file_hash = get_file_hash(content)
            filename = f"{file_hash}.jpg"
        else:
            filename = f"{get_file_hash(content)}_{filename}"

        img = Image.open(io.BytesIO(content))

        # Convert non-RGB modes to RGB
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        urls = {}
        for size_name, size in THUMBNAIL_SIZES.items():
            img_copy = img.copy()
            img_copy.thumbnail(size, Image.Resampling.LANCZOS)
            enhancer = ImageEnhance.Sharpness(img_copy)
            img_copy = enhancer.enhance(1.5)
            path = f"{UPLOAD_DIR}/{size_name}/{filename}"
            img_copy.save(path, 'JPEG', quality=85, optimize=True)
            urls[size_name] = f"/uploads/{size_name}/{filename}"

        logger.info(f"Image optimized: {filename}")
        return {
            'filename': filename,
            'urls': urls,
            'upload_time': datetime.now().isoformat(),
            'original_size': len(content),
            'success': True
        }

    except Exception as e:
        logger.error(f"Error optimizing image: {e}")
        return {'success': False, 'error': str(e)}


def compress_image(image_path, quality=75):
    """Compress an existing image file in-place."""
    try:
        img = Image.open(image_path)

        if img.mode != 'RGB':
            img = img.convert('RGB')

        output_path = image_path.replace('.jpg', '_compressed.jpg')
        img.save(output_path, 'JPEG', quality=quality, optimize=True)

        original_size = os.path.getsize(image_path)
        compressed_size = os.path.getsize(output_path)
        savings = ((original_size - compressed_size) / original_size) * 100

        logger.info(f"Compressed {image_path}: {savings:.1f}% savings")
        return {
            'path': output_path,
            'original_size': original_size,
            'compressed_size': compressed_size,
            'savings_percent': savings
        }

    except Exception as e:
        logger.error(f"Error compressing image: {e}")
        return None


def extract_image_features(image_path_or_url):
    """
    Extract visual features from an image — works with both local file paths AND URLs.
    Fix: the API endpoint passes a local temp file path, so we open it with Image.open()
    directly instead of trying to fetch it via requests.get().
    Args:
        image_path_or_url: local file system path OR http(s) URL string
    """
    try:
        if isinstance(image_path_or_url, str) and image_path_or_url.startswith(('http://', 'https://')):
            response = requests.get(image_path_or_url, timeout=10)
            response.raise_for_status()
            img = Image.open(io.BytesIO(response.content))
        else:
            img = Image.open(image_path_or_url)

        img_small = img.copy()
        img_small.thumbnail((150, 150))

        # Convert to RGB if needed so pixel analysis is consistent
        if img_small.mode != 'RGB':
            img_small = img_small.convert('RGB')

        pixels = list(img_small.getdata())

        features = {
            'dimensions': img.size,
            'format': img.format,
            'mode': img.mode,
            'pixel_count': len(pixels),
            'average_color': _get_average_color(pixels),
            'dominant_colors': _get_dominant_colors(pixels),
            'brightness': _get_brightness(pixels)
        }

        logger.info(f"Extracted features from image: {image_path_or_url}")
        return features

    except Exception as e:
        logger.error(f"Error extracting features: {e}")
        return None


def _get_average_color(pixels):
    """Get average RGB color. Fix: handles grayscale (int) pixels."""
    total_r = total_g = total_b = 0
    sample = pixels[:1000]
    for p in sample:
        r, g, b = _normalize_pixel(p)
        total_r += r
        total_g += g
        total_b += b
    count = len(sample)
    if count == 0:
        return [0, 0, 0]
    return [total_r // count, total_g // count, total_b // count]


def _get_dominant_colors(pixels, n_colors=5):
    """Get n most dominant colors. Fix: handles grayscale pixels."""
    from collections import Counter
    rgb_pixels = [_normalize_pixel(p) for p in pixels]
    color_counts = Counter(rgb_pixels)
    return [
        {'color': list(color), 'count': count}
        for color, count in color_counts.most_common(n_colors)
    ]


def _get_brightness(pixels):
    """Calculate average perceived brightness. Fix: handles grayscale pixels."""
    total_brightness = 0
    sample = pixels[:1000]
    for p in sample:
        r, g, b = _normalize_pixel(p)
        brightness = (r * 299 + g * 587 + b * 114) // 1000
        total_brightness += brightness
    count = len(sample)
    return total_brightness // count if count > 0 else 0


def validate_image(image_data, max_size_mb=10):
    """Validate that uploaded bytes represent a valid image within size limits."""
    try:
        if len(image_data) > max_size_mb * 1024 * 1024:
            return {'valid': False, 'error': f'Image exceeds {max_size_mb}MB limit'}

        img = Image.open(io.BytesIO(image_data))
        img.verify()

        # Re-open after verify (verify() exhausts the file pointer)
        img = Image.open(io.BytesIO(image_data))

        return {
            'valid': True,
            'format': img.format,
            'size': img.size,
            'width': img.width,
            'height': img.height,
            'file_size_bytes': len(image_data)
        }

    except Exception as e:
        logger.error(f"Invalid image: {e}")
        return {'valid': False, 'error': str(e)}


def batch_optimize_images(image_urls):
    """Optimize a list of images (URLs or bytes)."""
    results = []
    for i, url in enumerate(image_urls):
        try:
            result = optimize_product_image(url, f"batch_{i}")
            results.append(result)
        except Exception as e:
            logger.error(f"Error optimizing image {i}: {e}")
            results.append({'success': False, 'error': str(e)})
    return results