# utils.py
import datetime
import bcrypt
import jwt
from functools import wraps
from flask import request, jsonify
from config import Config

def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

# utils.py
def check_password(password: str, hashed) -> bool:
    # if old user where password was stored as plain text string
    if isinstance(hashed, str):
        return password == hashed

    # normal case: bcrypt bytes
    return bcrypt.checkpw(password.encode("utf-8"), hashed)

def create_jwt(user_id: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=6),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")

def decode_jwt(token: str):
    return jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])

def require_auth(role: str | None = None):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"message": "Missing token"}), 401

            token = auth_header.split(" ", 1)[1]
            try:
                payload = decode_jwt(token)
            except Exception:
                return jsonify({"message": "Invalid or expired token"}), 401

            if role and payload.get("role") != role:
                return jsonify({"message": "Forbidden"}), 403

            request.user = payload  # attach to request
            return fn(*args, **kwargs)

        return wrapper

    return decorator
