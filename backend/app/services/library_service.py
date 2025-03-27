from ..models.library_model import Library
from ..models.user_model import User
from ..models.music_model import Music
from app import db  # make sure you're importing the same way as in admin_service

def get_user_library(user_id: int):
    # Returns a list of Music objects by accessing the `music` relationship
    library_items = db.session.query(Library).filter(Library.user_id == user_id).all()
    return [item.music for item in library_items]


def add_to_library(user_id: int, music_id: int):
    existing = db.session.query(Library).filter(
        Library.user_id == user_id, Library.music_id == music_id
    ).first()
    if existing:
        return {"message": "Music already in library"}

    new_library_item = Library(user_id=user_id, music_id=music_id)
    db.session.add(new_library_item)
    db.session.commit()
    db.session.refresh(new_library_item)
    return {"message": "Music added to library"}

def remove_from_library(user_id: int, music_id: int):
    library_item = db.session.query(Library).filter(
        Library.user_id == user_id, Library.music_id == music_id
    ).first()
    if library_item:
        db.session.delete(library_item)
        db.session.commit()
        return {"message": "Music removed from library"}
    return {"message": "Music not found in library"}
