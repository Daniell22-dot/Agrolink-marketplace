# python-services/services/price_predictor.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from datetime import datetime, timedelta
from database import execute_query
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
        self.load_model()
    
    def train_model(self):
        """Train the price prediction model"""
        try:
            logger.info("Training price prediction model...")
            
            # Get training data
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
            
            # Prepare features
            df['demand'] = df['demand'].fillna(0)
            df['supply'] = df['supply'].fillna(0)
            df['season'] = df['season'].fillna(6)
            df['days_since_harvest'] = df['days_since_harvest'].fillna(30)
            
            # Encode categorical features
            self.encoder = LabelEncoder()
            df['category_encoded'] = self.encoder.fit_transform(df['category'].astype(str))
            
            # Prepare X and y
            X = df[['category_encoded', 'supply', 'demand', 'season', 'days_since_harvest']].values
            y = df['price'].values
            
            # Train model
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=15,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1
            )
            self.model.fit(X, y)
            
            # Save model
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
        """Load saved model"""
        try:
            if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
                with open(MODEL_PATH, 'rb') as f:
                    self.model = pickle.load(f)
                with open(ENCODER_PATH, 'rb') as f:
                    self.encoder = pickle.load(f)
                logger.info("Model loaded from disk")
            else:
                logger.info("No saved model found, will train new model")
                self.train_model()
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.train_model()
    
    def predict_price(self, category, supply=10, demand=5, season=None, days_since_harvest=30, quality_grade='standard'):
        """Predict product price"""
        try:
            if self.model is None or self.encoder is None:
                return None
            
            if season is None:
                season = datetime.now().month
            
            # Encode category
            try:
                category_encoded = self.encoder.transform([category])[0]
            except:
                category_encoded = np.mean([self.encoder.transform([c])[0] for c in self.encoder.classes_])
            
            # Prepare features
            features = np.array([[category_encoded, supply, demand, season, days_since_harvest]])
            
            # Make prediction
            predicted_price = self.model.predict(features)[0]
            
            # Apply quality grade multiplier
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
        """Get historical price trends"""
        try:
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
            WHERE p.category = '{category}'
            AND o.created_at >= DATE_SUB(NOW(), INTERVAL {days} DAY)
            GROUP BY DATE(o.created_at)
            ORDER BY date DESC
            """
            
            df = execute_query(query)
            
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
        """Get optimal selling price based on market conditions"""
        try:
            query = f"""
            SELECT 
                p.category,
                p.quantity_in_stock as supply,
                (SELECT COUNT(*) FROM order_items oi 
                 JOIN orders o ON oi.order_id = o.id 
                 WHERE oi.product_id = {product_id} 
                 AND o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as demand_7days,
                DATEDIFF(NOW(), p.created_at) as days_since_harvest,
                COALESCE(p.quality_grade, 'standard') as quality_grade,
                AVG(oi.price) as current_market_price
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            WHERE p.id = {product_id}
            GROUP BY p.id
            """
            
            df = execute_query(query)
            
            if df is None or df.empty:
                return None
            
            row = df.iloc[0]
            
            # Get predicted price
            predicted = self.predict_price(
                category=row['category'],
                supply=row['supply'],
                demand=row['demand_7days'],
                days_since_harvest=row['days_since_harvest'],
                quality_grade=row['quality_grade']
            )
            
            market_price = float(row['current_market_price']) if row['current_market_price'] else predicted
            
            # Optimal price is weighted average
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