import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME', 'agrolink')

# Create database URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db_session():
    """Get a database session"""
    return SessionLocal()

def execute_query(query):
    """Execute a query and return results as DataFrame"""
    try:
        df = pd.read_sql(query, engine)
        return df
    except Exception as e:
        print(f"Database error: {e}")
        return None

def close_connection():
    """Close database connection"""
    engine.dispose()
