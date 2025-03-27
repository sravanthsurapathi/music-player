from flask import Blueprint, jsonify, request
from ..services.user_service import get_all_music, play_music, pause_music, change_music
from ..utils.auth_utils import token_required
from werkzeug.security import generate_password_hash, check_password_hash
from ..utils.auth_utils import generate_token
from ..models.user_model import User
from app import db

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/music', methods=['GET'])
def get_music():
    music_list = get_all_music()
    return jsonify([{
        "id": m.id,
        "title": m.title,
        "artist": m.artist,
        "s3_url": m.s3_url
    } for m in music_list])

@user_routes.route('/play', methods=['POST'])
@token_required
def play():
    data = request.json
    track_id = data.get('track_id')
    return jsonify(play_music(track_id))

@user_routes.route('/pause', methods=['POST'])
@token_required
def pause():
    return jsonify(pause_music())

@user_routes.route('/change', methods=['POST'])
@token_required
def change():
    data = request.json
    track_id = data.get('track_id')
    return jsonify(change_music(track_id))

@user_routes.route('/login', methods=['POST'])
def user_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = db.session.query(User).filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        token = generate_token(user.username)
        return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401


@user_routes.route('/register', methods=['POST'])
def register_user():
    """
    Register a new user with a username and password.
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password, is_admin=False)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201