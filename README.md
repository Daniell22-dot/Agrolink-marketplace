# AgriLink Marketplace

AgroLink is an innovative digital marketplace connecting agricultural producers directly with buyers. Whether you're a farmer looking to sell your harvest, a retailer sourcing fresh produce, or a consumer seeking high-quality local products, AgriLink provides a seamless, secure, and efficient platform for all your agricultural commerce needs.

## Project Structure

- **frontend/**: User-facing React web application.
- **admin-panel/**: React-based administrative dashboard.
- **backend/**: Node.js/Express backend API connected to a MySQL database with Redis caching and Elasticsearch.
- **mobile-app/**: Mobile application for the marketplace.
- **database/** / **docker/** / **docs/**: Setup scripts, docker configuration, and documentation.

## Technologies Used

### Backend
- **Node.js & Express**: API framework.
- **Sequelize & MySQL**: Relational database ORM and storage.
- **Redis & Bull**: Caching and background job processing.
- **Elasticsearch**: Advanced search capabilities.
- **Socket.io**: Real-time communication.

### Frontend
- **React**: UI library.
- **Redux Toolkit**: State management.
- **React Router**: Navigation.
- **Socket.io Client**: Real-time updates.

  <img width="1366" height="687" alt="image" src="https://github.com/user-attachments/assets/deb55ca0-61e1-4152-b1d8-e27adca842a5" />

  Ml Reccomendations
  <img width="1366" height="682" alt="image" src="https://github.com/user-attachments/assets/1f0370af-397b-4eb1-98a5-80b4e07fdc5c" />



### Admin Panel
- **React & Redux**: Core framework and state management.
- **Tailwind CSS**: Styling and layout.
- **Chart.js & Recharts**: Analytics and data visualization.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- MySQL
- Redis
- Elasticsearch

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Daniell22-dot/Agrolink-marketplace.git
   ```

2. Install dependencies for all services:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   cd ../admin-panel && npm install
   ```

3. Configure Environment Variables:
   - Copy `.env.example` to `.env` in the respective directories (`frontend`, `backend`, `admin-panel`) and fill in your local config.

### Running the Application Locally

Start each service in a separate terminal:

**Backend API:**
```bash
cd backend
npm run dev
```

**Frontend Application:**
```bash
cd frontend
npm start
```

**Admin Panel:**
```bash
cd admin-panel
npm start
```

## Contributing
Contributions and suggestions are welcome.
