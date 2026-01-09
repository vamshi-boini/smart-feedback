
# auth_routes.py
from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
import datetime
import secrets

from db import users_col, reset_tokens_col
from utils import hash_password, check_password, create_jwt

auth_bp = Blueprint("auth", __name__, url_prefix="/api")


@auth_bp.post("/register")
def register():
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"message": "Missing fields"}), 400

    if users_col.find_one({"email": email}):
        return jsonify({"message": "Email already registered"}), 400

    user_doc = {
        "name": name,
        "email": email,
        "password_hash": hash_password(password),
        "role": "user",  # all API registrations are normal users
        "created_at": datetime.datetime.utcnow(),
    }
    result = users_col.insert_one(user_doc)

    return (
        jsonify(
            {
                "message": "Registered successfully",
                "user_id": str(result.inserted_id),
            }
        ),
        201,
    )


@auth_bp.post("/login")
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    is_admin = data.get("isAdmin", False)  # comes from frontend for admin login

    if not all([email, password]):
        return jsonify({"message": "Missing fields"}), 400

    user = users_col.find_one({"email": email})
    if not user or not check_password(password, user["password_hash"]):
        return jsonify({"message": "Invalid credentials"}), 401

    # if this attempt is from the admin login and user is not admin -> block
    if is_admin and user.get("role") != "admin":
        return jsonify({"message": "Only admin can log in from this panel"}), 403

    token = create_jwt(str(user["_id"]), user["role"])
    return jsonify(
        {
            "token": token,
            "role": user["role"],
            "name": user["name"],
        }
    )



@auth_bp.post("/forgot-password")
def forgot_password():
    data = request.json or {}
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        # do not reveal whether user exists
        return jsonify({"message": "If email exists, reset link sent"}), 200

    token = secrets.token_urlsafe(32)
    reset_tokens_col.insert_one(
        {
            "user_id": user["_id"],
            "token": token,
            "expires_at": datetime.datetime.utcnow()
            + datetime.timedelta(hours=1),
        }
    )

    # for project: just return token so you can test via frontend
    return jsonify({"message": "Reset token generated", "reset_token": token})


@auth_bp.post("/reset-password")
def reset_password():
    data = request.json or {}
    token = data.get("token")
    new_password = data.get("password")

    if not all([token, new_password]):
        return jsonify({"message": "Missing fields"}), 400

    doc = reset_tokens_col.find_one({"token": token})
    if not doc or doc["expires_at"] < datetime.datetime.utcnow():
        return jsonify({"message": "Invalid or expired token"}), 400

    users_col.update_one(
        {"_id": doc["user_id"]},
        {"$set": {"password_hash": hash_password(new_password)}},
    )
    reset_tokens_col.delete_one({"_id": doc["_id"]})

    return jsonify({"message": "Password updated successfully"})
