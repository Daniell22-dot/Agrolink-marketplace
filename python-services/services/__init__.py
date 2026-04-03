# services/__init__.py
from .recommendations import get_trending_products, get_recommended_for_user, get_trending_categories
from .analytics import get_dashboard_stats, generate_sales_report, get_user_analytics, get_top_products
from .price_predictor import predictor
from .image_processor import optimize_product_image, validate_image, extract_image_features

__all__ = [
    'get_trending_products',
    'get_recommended_for_user', 
    'get_trending_categories',
    'get_dashboard_stats',
    'generate_sales_report',
    'get_user_analytics',
    'get_top_products',
    'predictor',
    'optimize_product_image',
    'validate_image',
    'extract_image_features'
]
