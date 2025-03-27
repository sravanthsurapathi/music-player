from datetime import datetime, timedelta
import jwt
from flask import request, jsonify
from functools import wraps
from config import SECRET_KEY
from ..models.user_model import User
from app import db

# Example user database (replace with your actual user database)
users = {
    "admin": {"password": "admin123", "is_admin": True},
    "user1": {"password": "user123", "is_admin": False},
}

def generate_token(username):
    """
    Generate a JWT token for a user.
    :param username: Username of the user.
    :return: JWT token.
    """
    payload = {
        "username": username,
        "exp": datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def decode_token(token):
    """
    Decode a JWT token.
    :param token: JWT token to decode.
    :return: Decoded payload or error message.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}

def token_required(f):
    """
    Decorator to protect routes with token authentication.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        # ✅ Extract the actual token from "Bearer <token>"
        if token.startswith("Bearer "):
            token = token.replace("Bearer ", "")
        else:
            return jsonify({"error": "Invalid token format"}), 401

        payload = decode_token(token)

        if "error" in payload:
            return jsonify({"error": payload["error"]}), 401

        username = payload.get("username")
        user = db.session.query(User).filter_by(username=username).first()

        if not user:
            return jsonify({"error": "User not found"}), 401

        request.user_id = user.id  # ✅ Now this is an integer (safe for DB)
        return f(*args, **kwargs)

    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token missing or malformed"}), 401

        token = auth_header.split(" ")[1]

        payload = decode_token(token)
        if "error" in payload:
            return jsonify({"error": payload["error"]}), 401

        username = payload.get("username")
        if username not in users or not users[username]["is_admin"]:
            return jsonify({"error": "Admin access required"}), 403

        request.user_id = username
        return f(*args, **kwargs)
    return decorated
