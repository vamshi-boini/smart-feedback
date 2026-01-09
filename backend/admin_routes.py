# admin_routes.py
from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

from db import feedbacks_col
from utils import require_auth

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.get("/summary")
@require_auth(role="admin")
def summary():
    """
    Returns sentiment counts for charts, e.g.
    { "Positive": 10, "Negative": 3, "Neutral": 7 }
    """
    pipeline = [
        {"$group": {"_id": "$sentiment", "count": {"$sum": 1}}},
    ]
    data = list(feedbacks_col.aggregate(pipeline))
    result = {item["_id"]: item["count"] for item in data}
    return jsonify(result)


@admin_bp.get("/feedback")
@require_auth(role="admin")
def all_feedback():
    """
    Paginated list for admin table.
    Query params (optional): page, pageSize
    """
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("pageSize", 20))
    skip = (page - 1) * page_size

    total = feedbacks_col.count_documents({})
    cursor = (
        feedbacks_col.find({})
        .sort("created_at", -1)
        .skip(skip)
        .limit(page_size)
    )

    items = []
    for f in cursor:
        items.append(
            {
                "id": str(f["_id"]),
                "userId": str(f["user_id"]),
                "message": f["message"],
                "sentiment": f["sentiment"],
                "createdAt": f["created_at"].isoformat(),
                "important": f.get("important", False),
            }
        )

    return jsonify({"total": total, "items": items})


@admin_bp.patch("/feedback/<fid>/important")
@require_auth(role="admin")
def toggle_important(fid):
    """
    Toggle 'important' flag for a feedback document.
    """
    try:
        oid = ObjectId(fid)
    except Exception:
        return jsonify({"message": "Invalid id"}), 400

    doc = feedbacks_col.find_one({"_id": oid})
    if not doc:
        return jsonify({"message": "Not found"}), 404

    new_value = not doc.get("important", False)
    feedbacks_col.update_one({"_id": oid}, {"$set": {"important": new_value}})
    return jsonify({"important": new_value})


@admin_bp.delete("/feedback/<fid>")
@require_auth(role="admin")
def delete_feedback(fid):
    """
    Delete a feedback entry.
    """
    try:
        oid = ObjectId(fid)
    except Exception:
        return jsonify({"message": "Invalid id"}), 400

    result = feedbacks_col.delete_one({"_id": oid})
    if result.deleted_count == 0:
        return jsonify({"message": "Not found"}), 404

    return jsonify({"message": "Deleted"})
