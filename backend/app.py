# app.py
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from auth_routes import auth_bp
from feedback_routes import feedback_bp
from admin_routes import admin_bp


def create_app():
    app = Flask(__name__)

    # Allow React frontend to call API
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)

    # Health check
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    # Register blueprints
    app.register_blueprint(auth_bp)       # /api/register, /api/login, etc.
    app.register_blueprint(feedback_bp)   # /api/feedback, /api/my-feedback
    app.register_blueprint(admin_bp)      # /api/admin/...

    return app


app = create_app()

if __name__ == "__main__":
    # Local development
    app.run(host="0.0.0.0", port=5000, debug=True)
