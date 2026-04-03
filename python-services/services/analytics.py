# python-services/services/analytics.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from database import execute_query
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_dashboard_stats(start_date=None, end_date=None):
    """Get comprehensive dashboard statistics"""
    if start_date is None:
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    if end_date is None:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    try:
        stats = {}
        
        # Total users
        users_query = "SELECT COUNT(*) as total FROM users"
        users_df = execute_query(users_query)
        stats['total_users'] = int(users_df['total'].values[0]) if users_df is not None else 0
        
        # Farmer/Buyer split
        roles_query = "SELECT role, COUNT(*) as count FROM users GROUP BY role"
        roles_df = execute_query(roles_query)
        if roles_df is not None:
            for _, row in roles_df.iterrows():
                stats[f'total_{row["role"]}s'] = int(row['count'])
        
        # Total products
        products_query = "SELECT COUNT(*) as total FROM products WHERE status = 'active'"
        products_df = execute_query(products_query)
        stats['total_products'] = int(products_df['total'].values[0]) if products_df is not None else 0
        
        # Orders in date range
        orders_query = f"""
        SELECT 
            COUNT(*) as total_orders,
            SUM(total_amount) as total_revenue,
            AVG(total_amount) as avg_order_value
        FROM orders
        WHERE created_at BETWEEN '{start_date}' AND '{end_date}'
        AND status NOT IN ('cancelled', 'failed')
        """
        orders_df = execute_query(orders_query)
        if orders_df is not None:
            stats['total_orders'] = int(orders_df['total_orders'].values[0]) if orders_df['total_orders'].values[0] else 0
            stats['total_revenue'] = float(orders_df['total_revenue'].values[0]) if orders_df['total_revenue'].values[0] else 0
            stats['avg_order_value'] = float(orders_df['avg_order_value'].values[0]) if orders_df['avg_order_value'].values[0] else 0
        
        # Order statuses
        status_query = """
        SELECT status, COUNT(*) as count
        FROM orders
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY status
        """
        status_df = execute_query(status_query)
        if status_df is not None:
            for _, row in status_df.iterrows():
                stats[f'{row["status"]}_orders'] = int(row['count'])
        
        # Top categories
        categories_query = """
        SELECT p.category, COUNT(oi.id) as order_count, SUM(oi.quantity) as units_sold
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY p.category
        ORDER BY order_count DESC
        LIMIT 5
        """
        categories_df = execute_query(categories_query)
        stats['top_categories'] = []
        if categories_df is not None:
            for _, row in categories_df.iterrows():
                stats['top_categories'].append({
                    'name': str(row['category']),
                    'orders': int(row['order_count']),
                    'units': int(row['units_sold'])
                })
        
        # Average rating
        rating_query = "SELECT AVG(rating) as avg_rating FROM products WHERE rating IS NOT NULL"
        rating_df = execute_query(rating_query)
        stats['avg_product_rating'] = float(rating_df['avg_rating'].values[0]) if rating_df is not None and rating_df['avg_rating'].values[0] else 0
        
        logger.info(f"Dashboard stats retrieved: {len(stats)} metrics")
        return stats
        
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {e}")
        return {}


def generate_sales_report(start_date, end_date):
    """Generate detailed sales report"""
    try:
        query = f"""
        SELECT 
            DATE(o.created_at) as date,
            COUNT(o.id) as orders,
            COUNT(DISTINCT o.user_id) as unique_customers,
            SUM(o.total_amount) as revenue,
            AVG(o.total_amount) as avg_order_value,
            COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as completed_orders
        FROM orders o
        WHERE o.created_at BETWEEN '{start_date}' AND '{end_date}'
        AND o.status NOT IN ('cancelled', 'failed')
        GROUP BY DATE(o.created_at)
        ORDER BY date DESC
        """
        
        df = execute_query(query)
        
        if df is None or df.empty:
            return {
                'summary': {},
                'daily_data': []
            }
        
        report = {
            'summary': {
                'total_sales': float(df['revenue'].sum()),
                'avg_order_value': float(df['avg_order_value'].mean()),
                'total_orders': int(df['orders'].sum()),
                'total_customers': int(df['unique_customers'].sum()),
                'completed_orders': int(df['completed_orders'].sum()),
                'period': f"{start_date} to {end_date}"
            },
            'daily_data': []
        }
        
        for _, row in df.iterrows():
            report['daily_data'].append({
                'date': str(row['date']),
                'orders': int(row['orders']),
                'unique_customers': int(row['unique_customers']),
                'revenue': float(row['revenue']),
                'avg_order_value': float(row['avg_order_value']),
                'completed_orders': int(row['completed_orders'])
            })
        
        logger.info(f"Sales report generated for {start_date} to {end_date}")
        return report
        
    except Exception as e:
        logger.error(f"Error generating sales report: {e}")
        return {'summary': {}, 'daily_data': []}


def get_user_analytics(user_id):
    """Get analytics for a specific user"""
    try:
        user_query = f"""
        SELECT 
            id, fullName, email, role, created_at,
            (SELECT COUNT(*) FROM orders WHERE user_id = {user_id}) as total_orders,
            (SELECT SUM(total_amount) FROM orders WHERE user_id = {user_id}) as total_spent,
            (SELECT AVG(rating) FROM reviews WHERE user_id = {user_id}) as avg_rating_given
        FROM users
        WHERE id = {user_id}
        """
        
        user_df = execute_query(user_query)
        
        if user_df is None or user_df.empty:
            return None
        
        row = user_df.iloc[0]
        
        analytics = {
            'user_id': int(row['id']),
            'name': str(row['fullName']),
            'email': str(row['email']),
            'role': str(row['role']),
            'joined_date': str(row['created_at']),
            'total_orders': int(row['total_orders']) if row['total_orders'] else 0,
            'total_spent': float(row['total_spent']) if row['total_spent'] else 0,
            'avg_rating_given': float(row['avg_rating_given']) if row['avg_rating_given'] else 0
        }
        
        return analytics
        
    except Exception as e:
        logger.error(f"Error getting user analytics: {e}")
        return None


def get_top_products(limit=10, days=30):
    """Get top performing products"""
    try:
        query = f"""
        SELECT 
            p.id,
            p.name,
            p.price,
            p.rating,
            COUNT(oi.id) as order_count,
            SUM(oi.quantity) as total_units_sold,
            SUM(oi.quantity * oi.price) as total_revenue,
            AVG(r.rating) as avg_review_rating
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL {days} DAY)
        GROUP BY p.id, p.name, p.price, p.rating
        ORDER BY total_revenue DESC
        LIMIT {limit}
        """
        
        df = execute_query(query)
        
        if df is None or df.empty:
            return []
        
        products = []
        for _, row in df.iterrows():
            products.append({
                'id': int(row['id']),
                'name': str(row['name']),
                'price': float(row['price']),
                'rating': float(row['rating']) if row['rating'] else 0,
                'order_count': int(row['order_count']),
                'units_sold': int(row['total_units_sold']),
                'revenue': float(row['total_revenue']) if row['total_revenue'] else 0,
                'avg_review_rating': float(row['avg_review_rating']) if row['avg_review_rating'] else 0
            })
        
        return products
        
    except Exception as e:
        logger.error(f"Error getting top products: {e}")
        return []