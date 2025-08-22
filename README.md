# Banking Dashboard Server

This is the backend server for the banking dashboard application.

## Setup Instructions

Clone repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
### 1. Database Setup

1. Create a database named `bank`
2. insert the exported file 'bank.sql' into the created bd

### 2. Environment Variables (Optional)

You can set these environment variables to customize the database connection:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=''
DB_NAME=bank
```

### 3. Install Dependencies

```bash
for backend:
cd server
npm install
npm install express mysql2 cors dotenv
npm install --save-dev nodemon concurrently

for frontend: 
cd client
npm install
npm install react react-dom react-scripts
npm install bootstrap bootstrap-icons tailwindcss
npm install chart.js react-chartjs-2 recharts
npm install react-leaflet leaflet
npm install axios framer-motion
npm install lucide-react
```
### 4. Start the application in terminal

```bash
npm run dev
```

The server will start on port 5000 by default.

## API Endpoints

### Health Check
- `GET /healthz` - Server health check

### KPIs
- `GET /api/kpis` - Get key performance indicators


