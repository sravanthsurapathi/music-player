from flask import Blueprint, jsonify, request
from ..services.library_service import add_to_library, remove_from_library, get_user_library
from ..utils.auth_utils import token_required
from app import db

library_routes = Blueprint('library_routes', __name__)

@library_routes.route('/library', methods=['GET'])
@token_required
def get_library():
    user_id = request.user_id
    library = get_user_library(user_id)  # ✅ Fixed here
    return jsonify([{
        "id": track.id,
        "title": track.title,
        "artist": track.artist,
        "s3_url": track.s3_url
    } for track in library])

@library_routes.route('/library', methods=['POST'])
@token_required
def add_to_library_route():
    """
    Add a music track to the user's library.
    """
    user_id = request.user_id
    data = request.json
    music_id = data.get('music_id')
    add_to_library(user_id, music_id)
    return jsonify({"message": "Music added to library"})

@library_routes.route('/library/<int:music_id>', methods=['DELETE'])
@token_required
def remove_from_library_route(music_id):
    """
    Remove a music track from the user's library.
    """
    user_id = request.user_id
    remove_from_library(user_id, music_id)
    return jsonify({"message": "Music removed from library"})