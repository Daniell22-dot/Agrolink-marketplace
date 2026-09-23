# python-services/services/recommendations.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from .database import execute_query  # Fix: relative import
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_trending_products(limit=10, days=30):
    """Get trending products based on purchases, rating, and sales velocity."""
    try:
        query = f"""
        SELECT 
            p.id, p.name, p.images, p.price,
            COUNT(oi.id) as purchase_count,
            AVG(oi.quantity) as avg_quantity,
            SUM(oi.quantity * oi.price) as total_revenue,
            MAX(o.created_at) as last_sold
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at >= NOW() - INTERVAL '{int(days)} days'
        AND o.status NOT IN ('cancelled', 'failed')
        GROUP BY p.id, p.name, p.images, p.price
        ORDER BY purchase_count DESC, total_revenue DESC
        LIMIT {int(limit)}
        """
        df = execute_query(query)
        if df is None or df.empty:
            return []

        df['trending_score'] = (
            (df['purchase_count'] / df['purchase_count'].max()) * 0.5 +
            (df['total_revenue'].fillna(0) / df['total_revenue'].max()) * 0.3 +
            (df['avg_quantity'].fillna(0) / df['avg_quantity'].max()) * 0.2
        )
        df = df.sort_values('trending_score', ascending=False)

        products = []
        for _, row in df.iterrows():
            image_url = None
            images = row.get('images')
            if images is not None:
                if isinstance(images, list) and len(images) > 0:
                    image_url = images[0]
                elif isinstance(images, str):
                    try:
                        import json
                        parsed = json.loads(images)
                        if isinstance(parsed, list) and len(parsed) > 0:
                            image_url = parsed[0]
                    except Exception:
                        image_url = images if images else None

            products.append({
                'id': int(row['id']),
                'name': str(row['name']),
                'image_url': image_url,
                'price': float(row['price']),
                'rating': 0,
                'purchase_count': int(row['purchase_count']),
                'trending_score': float(row['trending_score'])
            })

        logger.info(f"Retrieved {len(products)} trending products")
        return products

    except Exception as e:
        logger.error(f"Error getting trending products: {e}")
        return []


def get_recommended_for_user(user_id, limit=10):
    """Personalized recommendations using purchase history and content similarity."""
    try:
        # Fix: added p.category to SELECT (was missing — caused KeyError at runtime)
        # Fix: parameterized user_id via :user_id to prevent SQL injection
        user_history_query = """
        SELECT DISTINCT p.id, oi.product_id, c.name as category, r.rating, oi.price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN reviews r ON r.product_id = p.id AND r.user_id = :user_id
        WHERE o.user_id = :user_id
        AND o.status NOT IN ('cancelled', 'failed')
        """
        user_products = execute_query(user_history_query, params={'user_id': user_id})

        if user_products is None or user_products.empty:
            return get_trending_products(limit)

        user_product_ids = set(user_products['product_id'].values)

        all_products_query = """
        SELECT 
            p.id, p.name, c.name as category, p.price, p.images,
            COUNT(oi.id) as popularity
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN categories c ON p.category_id = c.id
        GROUP BY p.id, p.name, c.name, p.price, p.images
        """
        all_products = execute_query(all_products_query)

        if all_products is None or all_products.empty:
            return []

        recommendations = []
        user_avg_price = user_products['price'].mean()
        user_categories = user_products['category'].unique()

        for _, product in all_products.iterrows():
            product_id = product['id']
            if product_id in user_product_ids:
                continue

            category_match = 1.0 if product['category'] in user_categories else 0.5
            price_similarity = 1.0 - abs(product['price'] - user_avg_price) / (user_avg_price + 1)
            popularity = product['popularity'] / (all_products['popularity'].max() + 1)
            rating_score = product['rating'] / 5.0 if product['rating'] else 0.5

            score = (category_match * 0.4 +
                     price_similarity * 0.2 +
                     popularity * 0.2 +
                     rating_score * 0.2)

            recommendations.append({
                'id': int(product_id),
                'name': str(product['name']),
                'category': str(product['category']) if product.get('category') else 'other',
                'price': float(product['price']),
                'rating': 0,
                'image_url': product['images'] if isinstance(product['images'], str) else (product['images'][0] if isinstance(product['images'], list) and product['images'] else None),
                'score': float(score)
            })

        recommendations = sorted(recommendations, key=lambda x: x['score'], reverse=True)
        logger.info(f"Generated {len(recommendations[:limit])} recommendations for user {user_id}")
        return recommendations[:limit]

    except Exception as e:
        logger.error(f"Error getting recommendations for user {user_id}: {e}")
        return get_trending_products(limit)


def get_trending_categories(limit=5):
    """Get trending product categories."""
    try:
        query = f"""
        SELECT 
            c.name as category,
            COUNT(oi.id) as order_count,
            SUM(oi.quantity) as total_units,
            AVG(p.rating) as avg_rating
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE o.created_at >= NOW() - INTERVAL '30 days'
        OR oi.id IS NULL
        GROUP BY c.name
        ORDER BY order_count DESC
        LIMIT {int(limit)}
        """
        df = execute_query(query)
        if df is None or df.empty:
            return []

        categories = []
        for _, row in df.iterrows():
            categories.append({
                'name': str(row['category']),
                'order_count': int(row['order_count']),
                'total_units': int(row['total_units']),
                'avg_rating': float(row['avg_rating']) if row['avg_rating'] else 0
            })
        return categories

    except Exception as e:
        logger.error(f"Error getting trending categories: {e}")
        return []
