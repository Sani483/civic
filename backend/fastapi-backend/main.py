from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
import psycopg2
from psycopg2.extras import RealDictCursor
import datetime

# FastAPI app
app = FastAPI(title="Civic-Sense API", version="1.0.0")

# Database connection
try:
    conn = psycopg2.connect(
        host="localhost",
        database="civicdb",
        user="postgres",
        password="shani@0802123",
        cursor_factory=RealDictCursor
    )
    print("✅ Database connected successfully")
except Exception as e:
    print("❌ Database connection failed:", e)

# JWT settings
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# User model
class UserSignup(BaseModel):
    name: str
    email: str
    password: str
    role: str = "citizen"

# ---------------- Helper ----------------
def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- ROUTES ----------------
@app.post("/signup")
def signup(user: UserSignup):
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email=%s", (user.email,))
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = pwd_context.hash(user.password)
    cur.execute(
        "INSERT INTO users (name,email,password,role) VALUES (%s,%s,%s,%s) RETURNING id,name,email,role",
        (user.name, user.email, hashed_pw, user.role)
    )
    new_user = cur.fetchone()
    conn.commit()
    cur.close()
    return {"message": "User registered successfully", "user": new_user}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email=%s", (form_data.username,))
    user = cur.fetchone()
    cur.close()

    if not user or not pwd_context.verify(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.get("/me")
def get_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"email": payload.get("sub"), "role": payload.get("role")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def root():
    return {"message": "🚀 Civic-Sense API is running"}

@app.get("/db-test")
def db_test():
    cur = conn.cursor()
    cur.execute("SELECT NOW();")
    result = cur.fetchone()
    cur.close()
    return {"db_time": result["now"]}
