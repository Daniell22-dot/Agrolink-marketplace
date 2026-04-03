# AgroLink Marketplace

AgroLink is a comprehensive full-stack e-commerce marketplace platform designed for agricultural products. It features a production-ready backend API, React web application, admin dashboard, mobile app, and Python-based ML microservices for AI-powered recommendations and analytics.

##  Key Features

- ** AI-Powered Recommendations**: ML-based product recommendations and trending analysis
- ** Price Prediction**: Machine learning-based price forecasting and market analysis
- ** Advanced Analytics**: Real-time dashboards, sales reports, and user analytics
- ** Image Processing**: Automatic image optimization with multiple size variants
- ** Farmer Dashboard**: Dedicated tools for agricultural product management
- ** Full E-commerce**: Shopping cart, orders, payments, and reviews
- ** Real-time Chat**: Socket.io-powered messaging between buyers and farmers
- ** Secure Auth**: JWT-based authentication with refresh tokens
- ** Multi-platform**: Web, admin panel, and mobile app support

## Project Structure

```
agrolink/
├── frontend/              # React web application (port 3000)
├── admin-panel/           # React admin dashboard (port 3001)
├── backend/               # Node.js/Express API (port 8000)
├── mobile-app/            # React Native mobile application
├── python-services/       # Python ML microservices (port 5000)
├── database/              # MySQL migrations, seeds, procedures
├── docker/                # Docker configurations
└── docs/                  # API documentation & guides
```

## 🛠 Technology Stack

### Backend Services
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **API Framework** | Node.js + Express | RESTful API server |
| **Database** | MySQL + Sequelize | Data persistence & ORM |
| **Caching** | Redis + Bull | Session & job management |
| **Search** | Elasticsearch | Advanced product search |
| **Real-time** | Socket.io | Live chat & notifications |
| **Auth** | JWT + bcrypt | Secure authentication |
| **ML Services** | Python + FastAPI | Recommendations, pricing, analytics |

### Frontend
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **UI Framework** | React 18 | User interface |
| **State Management** | Redux Toolkit | Global state |
| **Styling** | TailwindCSS | Responsive UI with green theme |
| **HTTP Client** | Axios | API communication |
| **Real-time** | Socket.io Client | Live updates |

### Admin Panel
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | React + Tailwind | Admin UI |
| **Visualization** | Chart.js + Recharts | Data visualization |
| **Complex UI** | Material-UI | Advanced components |

### Python ML Services
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | FastAPI | Async API server |
| **ML/Data** | scikit-learn + pandas | Machine learning models |
| **Image Processing** | Pillow | Image optimization |
| **Database** | SQLAlchemy | ORM for MySQL access |

##  API Overview

### Authentication Endpoints
```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/logout            - User logout
```

### Recommendations (ML-based)
```
GET    /api/recommendations/for-you              - Personalized recommendations
GET    /api/recommendations/similar/:productId   - Similar products
GET    /api/recommendations/trending             - Trending products
GET    /api/recommendations/recently-viewed      - User's viewed history
```

### Analytics & Insights
```
GET    /api/analytics/dashboard                  - Dashboard stats (admin)
POST   /api/analytics/sales-report               - Sales report by date (admin)
GET    /api/analytics/user/:userId               - User purchase analytics
GET    /api/analytics/top-products               - Top performing products
```

### Price Prediction
```
POST   /api/pricing/predict                      - Predict product price
GET    /api/pricing/trends/:category             - Price trends by category
GET    /api/pricing/optimal/:productId           - Optimal price recommendation
POST   /api/pricing/train-model                  - Retrain ML model (admin)
```

### Image Processing
```
POST   /api/images/optimize                      - Optimize image (4 sizes)
POST   /api/images/validate                      - Validate image format/size
POST   /api/images/features                      - Extract image features
POST   /api/images/batch-optimize                - Batch image processing (admin)
```

### Products, Orders, Cart
```
GET    /api/products                             - List all products
GET    /api/products/:id                         - Product details
GET    /api/orders                               - User's orders
POST   /api/cart/add                             - Add to cart
GET    /api/reviews/:productId                   - Product reviews
```

##  Getting Started

### Prerequisites
- **Node.js** v16+ or above
- **Python** 3.8+
- **MySQL** 5.7+
- **Redis** 6.0+
- **npm** or **yarn**

### Step 1: Clone & Install

```bash
git clone https://github.com/Daniell22-dot/Agrolink-marketplace.git
cd agrolink

# Install backend dependencies
cd backend && npm install
cd ../

# Install frontend dependencies
cd frontend && npm install
cd ../

# Install admin panel dependencies
cd admin-panel && npm install
cd ../

# Install Python services
cd python-services && pip install -r requirements.txt
cd ../
```

### Step 2: Configure Environment Variables

Create `.env` files in each directory:

**backend/.env**
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agrolink

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=refresh_secret
REFRESH_TOKEN_EXPIRE=30d

# Python Services
PYTHON_API_URL=http://localhost:5000

# API
PORT=8000
NODE_ENV=development
```

**python-services/.env**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agrolink
```

**frontend/.env**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:8000
```

**admin-panel/.env**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:8000
```

### Step 3: Setup Database

```bash
# Run migrations
cd backend
npm run migrate

# Seed sample data
npm run seed
cd ../
```

### Step 4: Start Services

Open separate terminals for each service:

**Terminal 1: Backend API**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:8000
```

**Terminal 2: Python ML Services**
```bash
cd python-services
python app.py
# Python service runs on http://localhost:5000
```

**Terminal 3: Frontend**
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

**Terminal 4: Admin Panel**
```bash
cd admin-panel
npm start
# Admin runs on http://localhost:3001
```

## 📱 Platform-Specific Guides

### For Farmers
- Register as a farmer to create agricultural product listings
- Use price prediction to set optimal prices for your products
- Track sales and revenue through the dashboard
- Communicate with buyers via the chat system

### For Buyers
- Browse and search agricultural products
- Get personalized product recommendations
- Add products to cart and make secure payments
- Rate and review products after purchase
- Chat directly with farmers/sellers

### For Admins
- View comprehensive analytics dashboard
- Manage users, products, and orders
- Generate sales and performance reports
- Monitor platform activity and user interactions

## 🔧 Development

### Project Commands

**Backend**
```bash
npm run dev          # Development with auto-reload
npm run migrate      # Run database migrations
npm run seed         # Seed sample data
npm test             # Run tests
npm run lint         # Run ESLint
```

**Frontend**
```bash
npm start            # Development server
npm run build        # Production build
npm test             # Run tests
npm run eject        # Eject from create-react-app
```

**Python Services**
```bash
python app.py                           # Development server
uvicorn app:app --reload --port 5000   # Using Uvicorn
python -m pytest                        # Run tests
```

## 🐳 Docker Deployment

```bash
# Build all services
docker-compose build

# Run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

##  Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

##  Documentation

- [API Documentation](./docs/api/) - Complete API reference
- [Deployment Guide](./docs/deployment/) - Production setup
- [Security Best Practices](./docs/security/) - Security guidelines
- [Farmer Guide](./docs/user-guides/farmer-guide.md) - Farmer features
- [Buyer Guide](./docs/user-guides/buyer-guide.md) - Buyer features

##  Security Features

-  JWT token-based authentication
-  Password hashing with bcrypt
-  Rate limiting on API endpoints
-  XSS protection with xss-clean
-  HTTPS/SSL ready
-  CORS configuration
-  SQL injection prevention via Sequelize ORM
-  Input validation and sanitization

## 🤝 Contributing

We welcome contributions to AgroLink! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute.

##  License

This project is licensed under the MIT License - see [LICENSE.md](./LICENSE.md) for details.

##  Support

For questions, issues, or feature requests:
- Open an issue on GitHub

## 🙏 Acknowledgments

- Built with ❤️ for the agricultural community
- Special thanks to our contributors and testers
- Inspired by major e-commerce platforms

---

**Last Updated**: April 2026
**Version**: 1.0.0
