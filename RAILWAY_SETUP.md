# Railway Database Setup

## Steps to Complete Setup:

### 1. Create Railway Database
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Wait for deployment

### 2. Get Connection String
1. In Railway dashboard → Click your PostgreSQL service
2. Go to "Connect" tab
3. Copy the "Postgres Connection URL"
4. It looks like: `postgresql://postgres:abc123@containers-us-west-1.railway.app:5432/railway`

### 3. Setup Environment
1. Create `.env` file in `backend/` folder:
```
DATABASE_URL=your-railway-connection-string-here
```

### 4. Setup Database Schema
1. In Railway dashboard → PostgreSQL → Query tab
2. Copy content from `backend/schema.sql`
3. Paste and execute

### 5. Run Project
```bash
# Backend (Express)
cd backend
npm install
npm run dev

# OR Backend (FastAPI)  
cd backend/fastapi-backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
expo start
```

## ✅ Done!
Now everyone can use the same cloud database automatically.