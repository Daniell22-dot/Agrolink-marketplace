# python-services/services/price_predictor.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from datetime import datetime, timedelta
from .database import execute_query  # Fix: relative import
import pickle
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_PATH = 'models/price_predictor_model.pkl'
ENCODER_PATH = 'models/category_encoder.pkl'


class PricePredictor:
    def __init__(self):
        self.model = None
        self.encoder = None
        self.features = ['category', 'supply', 'demand', 'season', 'days_since_harvest', 'quality_grade']
        # Fix: lazy load — only attempt to load saved model; do NOT auto-train at import
        # time because the DB may not be reachable, which would crash the whole service.
        self.load_model()

    def train_model(self):
        """Train the price prediction model."""
        try:
            logger.info("Training price prediction model...")

            query = """
            SELECT 
                p.category,
                p.price,
                COUNT(oi.id) as demand,
                p.quantity_in_stock as supply,
                MONTH(o.created_at) as season,
                DATEDIFF(NOW(), p.created_at) as days_since_harvest,
                COALESCE(p.quality_grade, 'standard') as quality_grade
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.id
            WHERE p.price > 0
            GROUP BY p.id, p.category, p.price, p.quantity_in_stock, season, days_since_harvest, quality_grade
            LIMIT 1000
            """
            df = execute_query(query)

            if df is None or df.empty:
                logger.warning("Not enough data to train model")
                return False

            df['demand'] = df['demand'].fillna(0)
            df['supply'] = df['supply'].fillna(0)
            df['season'] = df['season'].fillna(6)
            df['days_since_harvest'] = df['days_since_harvest'].fillna(30)

            self.encoder = LabelEncoder()
            df['category_encoded'] = self.encoder.fit_transform(df['category'].astype(str))

            X = df[['category_encoded', 'supply', 'demand', 'season', 'days_since_harvest']].values
            y = df['price'].values

            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=15,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1
            )
            self.model.fit(X, y)

            os.makedirs('models', exist_ok=True)
            with open(MODEL_PATH, 'wb') as f:
                pickle.dump(self.model, f)
            with open(ENCODER_PATH, 'wb') as f:
                pickle.dump(self.encoder, f)

            logger.info(f"Model trained with R² score: {self.model.score(X, y):.3f}")
            return True

        except Exception as e:
            logger.error(f"Error training model: {e}")
            return False

    def load_model(self):
        """Load saved model from disk. Does NOT auto-train if no model exists."""
        try:
            if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
                with open(MODEL_PATH, 'rb') as f:
                    self.model = pickle.load(f)
                with open(ENCODER_PATH, 'rb') as f:
                    self.encoder = pickle.load(f)
                logger.info("Model loaded from disk")
            else:
                # Fix: log a clear message instead of silently calling train_model()
                # at import time. Call POST /api/pricing/train-model to train explicitly.
                logger.warning(
                    "No saved model found. POST /api/pricing/train-model to train one."
                )
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.model = None
            self.encoder = None

    def predict_price(self, category, supply=10, demand=5, season=None,
                      days_since_harvest=30, quality_grade='standard'):
        """Predict product price."""
        try:
            if self.model is None or self.encoder is None:
                logger.warning("Model not trained yet — call /api/pricing/train-model first")
                return None

            if season is None:
                season = datetime.now().month

            # Fix: replaced bare except with specific ValueError to log unseen categories
            try:
                category_encoded = self.encoder.transform([category])[0]
            except ValueError:
                logger.warning(f"Unknown category '{category}', using mean encoding")
                category_encoded = float(np.mean(self.encoder.transform(self.encoder.classes_)))

            features = np.array([[category_encoded, supply, demand, season, days_since_harvest]])
            predicted_price = self.model.predict(features)[0]

            quality_multipliers = {
                'premium': 1.3,
                'excellent': 1.2,
                'good': 1.0,
                'standard': 1.0,
                'fair': 0.8,
                'poor': 0.6
            }
            multiplier = quality_multipliers.get(quality_grade, 1.0)
            final_price = predicted_price * multiplier

            logger.info(f"Predicted price for {category}: {final_price:.2f}")
            return float(max(final_price, 100))

        except Exception as e:
            logger.error(f"Error predicting price: {e}")
            return None

    def get_price_trends(self, category, days=90):
        """Get historical price trends for a category."""
        try:
            # Fix: parameterized category (string user input) to prevent SQL injection
            query = f"""
            SELECT 
                DATE(o.created_at) as date,
                AVG(oi.price) as avg_price,
                MIN(oi.price) as min_price,
                MAX(oi.price) as max_price,
                COUNT(oi.id) as transactions
            FROM products p
            JOIN order_items oi ON p.id = oi.product_id
            JOIN orders o ON oi.order_id = o.id
            WHERE p.category = :category
            AND o.created_at >= DATE_SUB(NOW(), INTERVAL {int(days)} DAY)
            GROUP BY DATE(o.created_at)
            ORDER BY date DESC
            """
            df = execute_query(query, params={'category': category})

            if df is None or df.empty:
                return []

            trends = []
            for _, row in df.iterrows():
                trends.append({
                    'date': str(row['date']),
                    'avg_price': float(row['avg_price']),
                    'min_price': float(row['min_price']),
                    'max_price': float(row['max_price']),
                    'transactions': int(row['transactions'])
                })
            return trends

        except Exception as e:
            logger.error(f"Error getting price trends: {e}")
            return []

    def get_optimal_price(self, product_id):
        """Get optimal selling price based on market conditions."""
        try:
            # product_id is typed int by FastAPI — safe for f-string
            query = f"""
            SELECT 
                p.category,
                p.quantity_in_stock as supply,
                (SELECT COUNT(*) FROM order_items oi 
                 JOIN orders o ON oi.order_id = o.id 
                 WHERE oi.product_id = {int(product_id)} 
                 AND o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as demand_7days,
                DATEDIFF(NOW(), p.created_at) as days_since_harvest,
                COALESCE(p.quality_grade, 'standard') as quality_grade,
                AVG(oi.price) as current_market_price
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            WHERE p.id = {int(product_id)}
            GROUP BY p.id
            """
            df = execute_query(query)

            if df is None or df.empty:
                return None

            row = df.iloc[0]

            predicted = self.predict_price(
                category=row['category'],
                supply=row['supply'],
                demand=row['demand_7days'],
                days_since_harvest=row['days_since_harvest'],
                quality_grade=row['quality_grade']
            )

            market_price = float(row['current_market_price']) if row['current_market_price'] else predicted
            optimal_price = (predicted * 0.6 + market_price * 0.4) if predicted else market_price

            return {
                'product_id': int(product_id),
                'predicted_price': float(predicted) if predicted else None,
                'market_price': float(market_price),
                'optimal_price': float(optimal_price),
                'range': {
                    'min': float(optimal_price * 0.85),
                    'max': float(optimal_price * 1.15)
                }
            }

        except Exception as e:
            logger.error(f"Error getting optimal price: {e}")
            return None


# Initialize global predictor
predictor = PricePredictor()