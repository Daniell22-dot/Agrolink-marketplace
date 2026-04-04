from fastapi import FastAPI, HTTPException, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

# Import services
from services.recommendations import get_trending_products, get_recommended_for_user, get_trending_categories
from services.analytics import get_dashboard_stats, generate_sales_report, get_user_analytics, get_top_products
from services.price_predictor import predictor
from services.image_processor import optimize_product_image, validate_image, extract_image_features

load_dotenv()

app = FastAPI(title="AgroLink Python Services", version="1.0.0")

# Enable CORS
# Fix: allow_credentials=True is incompatible with allow_origins=["*"] — browsers
# reject this combination. For production, replace "*" with your specific frontend URL
# and re-enable allow_credentials=True if cookies/auth headers are needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== REQUEST MODELS ====================

class PricePredicationRequest(BaseModel):
    category: str
    supply: int = 10
    demand: int = 5
    season: Optional[int] = None
    days_since_harvest: int = 30
    quality_grade: str = 'standard'

class SalesReportRequest(BaseModel):
    start_date: str
    end_date: str

# ==================== HEALTH & INFO ====================

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "AgroLink Python Services"}

@app.get("/")
def root():
    """Root endpoint with service info"""
    return {
        "name": "AgroLink Python Services",
        "version": "1.0.0",
        "services": [
            "recommendations",
            "analytics",
            "price-prediction",
            "image-processing"
        ]
    }

# ==================== RECOMMENDATIONS ENDPOINTS ====================

@app.get("/api/recommendations/trending")
def get_trending(limit: int = Query(10, ge=1, le=50)):
    """Get trending products"""
    try:
        products = get_trending_products(limit=limit)
        return {
            "success": True,
            "data": products,
            "count": len(products)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommendations/for-user/{user_id}")
def get_personalized(user_id: int, limit: int = Query(10, ge=1, le=50)):
    """Get recommendations for user"""
    try:
        recommendations = get_recommended_for_user(user_id, limit=limit)
        return {
            "success": True,
            "user_id": user_id,
            "data": recommendations,
            "count": len(recommendations)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommendations/categories")
def get_categories(limit: int = Query(5, ge=1, le=20)):
    """Get trending categories"""
    try:
        categories = get_trending_categories(limit=limit)
        return {
            "success": True,
            "data": categories,
            "count": len(categories)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ANALYTICS ENDPOINTS ====================

@app.get("/api/analytics/dashboard")
def get_dashboard(start_date: Optional[str] = None, end_date: Optional[str] = None):
    """Get dashboard statistics"""
    try:
        stats = get_dashboard_stats(start_date, end_date)
        return {
            "success": True,
            "data": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/sales-report")
def get_sales(request: SalesReportRequest):
    """Generate sales report"""
    try:
        report = generate_sales_report(request.start_date, request.end_date)
        return {
            "success": True,
            "data": report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/user/{user_id}")
def get_user(user_id: int):
    """Get user analytics"""
    try:
        analytics = get_user_analytics(user_id)
        if not analytics:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "success": True,
            "data": analytics
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/top-products")
def get_top(limit: int = Query(10, ge=1, le=50), days: int = Query(30, ge=1, le=365)):
    """Get top performing products"""
    try:
        products = get_top_products(limit=limit, days=days)
        return {
            "success": True,
            "data": products,
            "count": len(products)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== PRICE PREDICTION ENDPOINTS ====================

@app.post("/api/pricing/predict")
def predict_price(request: PricePredicationRequest):
    """Predict product price"""
    try:
        price = predictor.predict_price(
            category=request.category,
            supply=request.supply,
            demand=request.demand,
            season=request.season,
            days_since_harvest=request.days_since_harvest,
            quality_grade=request.quality_grade
        )
        
        if price is None:
            raise HTTPException(status_code=400, detail="Could not predict price")
        
        return {
            "success": True,
            "predicted_price": price,
            "category": request.category,
            "parameters": {
                "supply": request.supply,
                "demand": request.demand,
                "quality_grade": request.quality_grade
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/pricing/trends/{category}")
def get_price_trends(category: str, days: int = Query(90, ge=1, le=365)):
    """Get price trends for category"""
    try:
        trends = predictor.get_price_trends(category, days=days)
        return {
            "success": True,
            "category": category,
            "data": trends,
            "count": len(trends)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/pricing/optimal/{product_id}")
def get_optimal_price(product_id: int):
    """Get optimal price for product"""
    try:
        pricing = predictor.get_optimal_price(product_id)
        if not pricing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return {
            "success": True,
            "data": pricing
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pricing/train-model")
def train_model():
    """Retrain price prediction model"""
    try:
        success = predictor.train_model()
        return {
            "success": success,
            "message": "Model training completed" if success else "Model training failed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== IMAGE PROCESSING ENDPOINTS ====================

@app.post("/api/images/optimize")
async def optimize_image(file: UploadFile = File(...)):
    """Optimize product image"""
    try:
        content = await file.read()
        
        # Validate image
        validation = validate_image(content)
        if not validation['valid']:
            raise HTTPException(status_code=400, detail=validation['error'])
        
        # Optimize image
        result = optimize_product_image(content, file.filename)
        
        if not result['success']:
            raise HTTPException(status_code=400, detail=result.get('error', 'Failed to optimize image'))
        
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/images/validate")
async def validate(file: UploadFile = File(...)):
    """Validate image file"""
    try:
        content = await file.read()
        validation = validate_image(content)
        return {
            "success": True,
            "data": validation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/images/features")
async def extract_features(file: UploadFile = File(...)):
    """Extract image features"""
    try:
        content = await file.read()
        validation = validate_image(content)
        if not validation['valid']:
            raise HTTPException(status_code=400, detail=validation['error'])
        
        # Save temporarily and extract features
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(content)
            tmp_path = tmp.name
        
        features = extract_image_features(tmp_path)
        os.unlink(tmp_path)
        
        if not features:
            raise HTTPException(status_code=400, detail="Could not extract features")
        
        return {
            "success": True,
            "data": features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ERROR HANDLERS ====================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": str(exc)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 5000))
    )