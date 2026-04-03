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
    """Create upload directory if it doesn't exist"""
    Path(UPLOAD_DIR).mkdir(exist_ok=True)
    for size in THUMBNAIL_SIZES.keys():
        Path(f"{UPLOAD_DIR}/{size}").mkdir(exist_ok=True)

def get_file_hash(content):
    """Generate hash for file to avoid duplicates"""
    return hashlib.md5(content).hexdigest()

def optimize_product_image(image_data, filename=None):
    """
    Optimize product image - download, resize, compress
    Args:
        image_data: bytes or file URL
        filename: optional custom filename
    Returns:
        dict with paths to different sizes
    """
    try:
        ensure_upload_dir()
        
        # Download image if URL
        if isinstance(image_data, str):
            response = requests.get(image_data, timeout=10)
            content = response.content
        else:
            content = image_data
        
        # Generate filename
        if not filename:
            file_hash = get_file_hash(content)
            filename = f"{file_hash}.jpg"
        else:
            filename = f"{get_file_hash(content)}_{filename}"
        
        # Open image
        img = Image.open(io.BytesIO(content))
        
        # Convert RGBA to RGB if needed
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Optimize and save in different sizes
        urls = {}
        for size_name, size in THUMBNAIL_SIZES.items():
            # Create thumbnail
            img_copy = img.copy()
            img_copy.thumbnail(size, Image.Resampling.LANCZOS)
            
            # Enhance quality
            enhancer = ImageEnhance.Sharpness(img_copy)
            img_copy = enhancer.enhance(1.5)
            
            # Save
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
        return {
            'success': False,
            'error': str(e)
        }


def compress_image(image_path, quality=75):
    """
    Compress existing image
    """
    try:
        img = Image.open(image_path)
        
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Save compressed
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


def extract_image_features(image_url):
    """
    Extract features from image (for ML/categorization)
    Returns: color palette, dimensions, dominant colors
    """
    try:
        response = requests.get(image_url, timeout=10)
        img = Image.open(io.BytesIO(response.content))
        
        # Get dominant colors
        img_small = img.copy()
        img_small.thumbnail((150, 150))
        pixels = list(img_small.getdata())
        
        # Get image features
        features = {
            'dimensions': img.size,
            'format': img.format,
            'mode': img.mode,
            'pixel_count': len(pixels),
            'average_color': _get_average_color(pixels),
            'dominant_colors': _get_dominant_colors(pixels),
            'brightness': _get_brightness(pixels)
        }
        
        logger.info(f"Extracted features from image: {image_url}")
        return features
        
    except Exception as e:
        logger.error(f"Error extracting features: {e}")
        return None


def _get_average_color(pixels):
    """Get average color from pixels"""
    total_r = total_g = total_b = 0
    for r, g, b in [p[:3] if len(p) >= 3 else (p, p, p) for p in pixels[:1000]]:
        total_r += r
        total_g += g
        total_b += b
    
    count = min(1000, len(pixels))
    return [total_r // count, total_g // count, total_b // count]


def _get_dominant_colors(pixels, n_colors=5):
    """Get n dominant colors"""
    from collections import Counter
    
    rgb_pixels = [tuple(p[:3] if len(p) >= 3 else (p, p, p)) for p in pixels]
    color_counts = Counter(rgb_pixels)
    
    return [
        {'color': list(color), 'count': count}
        for color, count in color_counts.most_common(n_colors)
    ]


def _get_brightness(pixels):
    """Calculate average brightness"""
    total_brightness = 0
    for p in pixels[:1000]:
        r, g, b = p[:3] if len(p) >= 3 else (p, p, p)
        brightness = (r * 299 + g * 587 + b * 114) // 1000
        total_brightness += brightness
    
    return total_brightness // min(1000, len(pixels))


def validate_image(image_data, max_size_mb=10):
    """
    Validate image file
    """
    try:
        # Check file size
        if len(image_data) > max_size_mb * 1024 * 1024:
            return {
                'valid': False,
                'error': f'Image exceeds {max_size_mb}MB limit'
            }
        
        # Check if valid image
        img = Image.open(io.BytesIO(image_data))
        img.verify()
        
        # Re-open after verify
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
        return {
            'valid': False,
            'error': str(e)
        }


def batch_optimize_images(image_urls):
    """Optimize multiple images"""
    results = []
    for i, url in enumerate(image_urls):
        try:
            result = optimize_product_image(url, f"batch_{i}")
            results.append(result)
        except Exception as e:
            logger.error(f"Error optimizing image {i}: {e}")
            results.append({'success': False, 'error': str(e)})
    
    return results