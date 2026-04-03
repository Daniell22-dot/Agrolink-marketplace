# python-services/services/recommendations.py
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
from database import execute_query
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_trending_products(limit=10, days=30):
    """
    Get trending products based on:
    1. Number of recent purchases
    2. Average rating
    3. Sales velocity
    """
    try:
        query = f"""
        SELECT 
            p.id,
            p.name,
            p.image_url,
            p.price,
            p.rating,
            COUNT(oi.id) as purchase_count,
            AVG(oi.quantity) as avg_quantity,
            SUM(oi.quantity * oi.price) as total_revenue,
            MAX(o.created_at) as last_sold
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL {days} DAY)
        AND o.status NOT IN ('cancelled', 'failed')
        GROUP BY p.id, p.name, p.image_url, p.price, p.rating
        ORDER BY purchase_count DESC, total_revenue DESC, p.rating DESC
        LIMIT {limit}
        """
        
        df = execute_query(query)
        
        if df is None or df.empty:
            return []
        
        # Calculate trending score
        df['trending_score'] = (
            (df['purchase_count'] / df['purchase_count'].max()) * 0.4 +
            (df['total_revenue'].fillna(0) / df['total_revenue'].max()) * 0.3 +
            (df['rating'].fillna(0) / 5.0) * 0.3
        )
        
        df = df.sort_values('trending_score', ascending=False)
        
        products = []
        for _, row in df.iterrows():
            products.append({
                'id': int(row['id']),
                'name': str(row['name']),
                'image_url': str(row['image_url']) if row['image_url'] else None,
                'price': float(row['price']),
                'rating': float(row['rating']) if row['rating'] else 0,
                'purchase_count': int(row['purchase_count']),
                'trending_score': float(row['trending_score'])
            })
        
        logger.info(f"Retrieved {len(products)} trending products")
        return products
        
    except Exception as e:
        logger.error(f"Error getting trending products: {e}")
        return []


def get_recommended_for_user(user_id, limit=10):
    """
    Personalized recommendations using:
    1. Collaborative Filtering (similar users' purchases)
    2. Content-Based (similar products)
    3. Purchase history
    """
    try:
        # Get user's purchase history and ratings
        user_history_query = f"""
        SELECT DISTINCT p.id, oi.product_id, r.rating, oi.price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN reviews r ON r.product_id = p.id AND r.user_id = {user_id}
        WHERE o.user_id = {user_id}
        AND o.status NOT IN ('cancelled', 'failed')
        """
        
        user_products = execute_query(user_history_query)
        
        if user_products is None or user_products.empty:
            # No purchase history - return trending
            return get_trending_products(limit)
        
        user_product_ids = set(user_products['product_id'].values)
        
        # Get all products with their features
        all_products_query = """
        SELECT 
            p.id,
            p.name,
            p.category,
            p.price,
            p.rating,
            p.image_url,
            COUNT(oi.id) as popularity
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        GROUP BY p.id, p.name, p.category, p.price, p.rating, p.image_url
        """
        
        all_products = execute_query(all_products_query)
        
        if all_products is None or all_products.empty:
            return []
        
        # Find similar products based on category and price
        recommendations = []
        user_avg_price = user_products['price'].mean()
        user_categories = user_products['category'].unique()
        
        for _, product in all_products.iterrows():
            product_id = product['id']
            
            # Skip already purchased
            if product_id in user_product_ids:
                continue
            
            # Calculate similarity score
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
                'category': str(product['category']),
                'price': float(product['price']),
                'rating': float(product['rating']) if product['rating'] else 0,
                'image_url': str(product['image_url']) if product['image_url'] else None,
                'score': float(score)
            })
        
        # Sort by score and return top N
        recommendations = sorted(recommendations, key=lambda x: x['score'], reverse=True)
        
        logger.info(f"Generated {len(recommendations[:limit])} recommendations for user {user_id}")
        return recommendations[:limit]
        
    except Exception as e:
        logger.error(f"Error getting recommendations for user {user_id}: {e}")
        return get_trending_products(limit)


def get_trending_categories(limit=5):
    """Get trending product categories"""
    try:
        query = f"""
        SELECT 
            p.category,
            COUNT(oi.id) as order_count,
            SUM(oi.quantity) as total_units,
            AVG(p.rating) as avg_rating
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        OR oi.id IS NULL
        GROUP BY p.category
        ORDER BY order_count DESC
        LIMIT {limit}
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
