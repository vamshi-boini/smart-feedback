# feedback_routes.py
from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
import datetime
from textblob import TextBlob

from db import feedbacks_col, users_col  # <-- add users_col import
from utils import require_auth

feedback_bp = Blueprint("feedback", __name__, url_prefix="/api")


def simple_sentiment(text: str) -> str:
    """
    Sentiment using TextBlob polarity:
    - polarity > 0.1  => Positive
    - polarity < -0.1 => Negative
    - otherwise       => Neutral
    """
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1.0 .. 1.0

    if polarity > 0.1:
        return "Positive"
    if polarity < -0.1:
        return "Negative"
    return "Neutral"


@feedback_bp.post("/feedback")
@require_auth(role="user")
def submit_feedback():
    data = request.json or {}
    message = data.get("message")
    if not message:
        return jsonify({"message": "Message required"}), 400

    sentiment = simple_sentiment(message)
    doc = {
        "user_id": ObjectId(request.user["user_id"]),
        "message": message,
        "sentiment": sentiment,
        "created_at": datetime.datetime.utcnow(),
        "important": False,
    }
    result = feedbacks_col.insert_one(doc)

    return (
        jsonify(
            {
                "message": "Feedback saved",
                "id": str(result.inserted_id),
                "sentiment": sentiment,
            }
        ),
        201,
    )


@feedback_bp.get("/my-feedback")
@require_auth(role="user")
def my_feedback():
    user_id = ObjectId(request.user["user_id"])
    cursor = feedbacks_col.find({"user_id": user_id}).sort("created_at", -1)

    items = []
    for f in cursor:
        items.append(
            {
                "id": str(f["_id"]),
                "message": f["message"],
                "sentiment": f["sentiment"],
                "createdAt": f["created_at"].isoformat(),
            }
        )

    return jsonify(items)


# ---------- ADMIN ENDPOINTS ----------

@feedback_bp.get("/admin/feedback")
@require_auth(role="admin")
def admin_feedback_list():
    """
    Return all feedback with attached user name so admin table
    can show the exact name instead of 'User' or 'Unknown'.
    """
    cursor = feedbacks_col.find().sort("created_at", -1)

    items = []
    for f in cursor:
        user = users_col.find_one({"_id": f["user_id"]})
        user_name = user["name"] if user else "Unknown"

        items.append(
            {
                "id": str(f["_id"]),
                "userName": user_name,
                "message": f["message"],
                "sentiment": f["sentiment"],
                "createdAt": f["created_at"].isoformat(),
                "important": f.get("important", False),
            }
        )

    return jsonify({"items": items})


@feedback_bp.get("/admin/summary")
@require_auth(role="admin")
def admin_summary():
    """
    Simple counts of sentiments for the dashboard cards & pie chart.
    """
    counts = {"Positive": 0, "Negative": 0, "Neutral": 0}
    cursor = feedbacks_col.find()
    for f in cursor:
        s = f.get("sentiment")
        if s in counts:
            counts[s] += 1

    return jsonify(counts)
