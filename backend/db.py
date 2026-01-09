# db.py
from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGODB_URI)
db = client[Config.DB_NAME]

users_col = db["users"]
feedbacks_col = db["feedbacks"]
reset_tokens_col = db["reset_tokens"]
