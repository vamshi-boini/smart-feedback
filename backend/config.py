# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "smart_feedback")
    JWT_SECRET = os.getenv("JWT_SECRET", "change_this_secret")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
