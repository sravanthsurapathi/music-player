from app import db
from ..models.music_model import Music

def get_all_music():
    """
    Fetch all music tracks from the database.
    """
    return db.session.query(Music).all()

def get_music_by_id(music_id: int):
    """
    Fetch a specific music track by ID.
    """
    return db.session.query(Music).filter(Music.id == music_id).first()

def add_music(title: str, artist: str, s3_url: str):
    """
    Add a new music track to the database.
    """
    new_music = Music(title=title, artist=artist, s3_url=s3_url)
    db.session.add(new_music)
    db.session.commit()
    db.session.refresh(new_music)
    return new_music

def update_music(music_id: int, title: str, artist: str, s3_url: str):
    """
    Update an existing music track in the database.
    """
    music = db.session.query(Music).filter(Music.id == music_id).first()
    if music:
        music.title = title
        music.artist = artist
        music.s3_url = s3_url
        db.session.commit()
        db.session.refresh(music)
    return music

def delete_music(music_id: int):
    """
    Delete a music track from the database.
    """
    music = db.session.query(Music).filter(Music.id == music_id).first()
    if music:
        db.session.delete(music)
        db.session.commit()
        return True
    return False
