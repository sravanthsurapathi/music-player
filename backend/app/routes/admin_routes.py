from flask import Blueprint, jsonify, request
from ..services.admin_service import add_music, update_music, delete_music, get_all_music
from ..utils.auth_utils import admin_required, generate_token
from ..models.user_model import User
from werkzeug.security import check_password_hash, generate_password_hash
from app import db

admin_routes = Blueprint('admin_routes', __name__)

# MUSIC ROUTES
@admin_routes.route('/music', methods=['GET'])
@admin_required
def get_music():
    music = get_all_music()
    return jsonify([{
        "id": m.id,
        "title": m.title,
        "artist": m.artist,
        "s3_url": m.s3_url
    } for m in music])

@admin_routes.route('/music', methods=['POST'])
@admin_required
def create_music():
    data = request.json
    title = data.get('title')
    artist = data.get('artist')
    s3_url = data.get('s3_url')
    new_music = add_music(title, artist, s3_url)
    return jsonify({
        "message": "Music added",
        "music": {
            "id": new_music.id,
            "title": new_music.title,
            "artist": new_music.artist,
            "s3_url": new_music.s3_url
        }
    })

@admin_routes.route('/music/<int:music_id>', methods=['PUT'])
@admin_required
def update(music_id):
    data = request.json
    title = data.get('title')
    artist = data.get('artist')
    s3_url = data.get('s3_url')
    updated_music = update_music(music_id, title, artist, s3_url)
    return jsonify({
        "message": "Music updated",
        "music": {
            "id": updated_music.id,
            "title": updated_music.title,
            "artist": updated_music.artist,
            "s3_url": updated_music.s3_url
        }
    })

@admin_routes.route('/music/<int:music_id>', methods=['DELETE'])
@admin_required
def delete(music_id):
    delete_music(music_id)
    return jsonify({"message": "Music deleted"})


# USER ROUTES
@admin_routes.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = db.session.query(User).all()
    return jsonify([
        {
            "id": user.id,
            "username": user.username,
            "is_admin": user.is_admin
        } for user in users
    ])

@admin_routes.route('/users', methods=['POST'])
@admin_required
def create_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    is_admin = data.get('is_admin', False)

    if db.session.query(User).filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(
        username=username,
        password=generate_password_hash(password),
        is_admin=is_admin
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "is_admin": new_user.is_admin
        }
    })

@admin_routes.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    data = request.get_json()
    user = db.session.query(User).get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.username = data.get('username', user.username)
    if data.get('password'):
        user.password = generate_password_hash(data['password'])
    user.is_admin = data.get('is_admin', user.is_admin)

    db.session.commit()

    return jsonify({
        "message": "User updated",
        "user": {
            "id": user.id,
            "username": user.username,
            "is_admin": user.is_admin
        }
    })

@admin_routes.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = db.session.query(User).get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})


# ADMIN LOGIN
@admin_routes.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = db.session.query(User).filter_by(username=username, is_admin=True).first()

    if user and check_password_hash(user.password, password):
        token = generate_token(user.username)
        return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401
