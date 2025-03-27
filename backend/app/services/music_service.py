from sqlalchemy.orm import Session
from ..models.music_model import Music

def get_all_music(db: Session):
    """
    Fetch all music tracks.
    """
    return db.query(Music).all()

def get_music_by_id(music_id: int, db: Session):
    """
    Fetch a specific music track by ID.
    """
    return db.query(Music).filter(Music.id == music_id).first()

def add_music(title: str, artist: str, s3_url: str, db: Session):
    """
    Add a new music track.
    """
    new_music = Music(title=title, artist=artist, s3_url=s3_url)
    db.add(new_music)
    db.commit()
    db.refresh(new_music)
    return new_music

def update_music(music_id: int, title: str, artist: str, s3_url: str, db: Session):
    """
    Update an existing music track.
    """
    music = db.query(Music).filter(Music.id == music_id).first()
    if music:
        music.title = title
        music.artist = artist
        music.s3_url = s3_url
        db.commit()
        db.refresh(music)
    return music

def delete_music(music_id: int, db: Session):
    """
    Delete a music track.
    """
    music = db.query(Music).filter(Music.id == music_id).first()
    if music:
        db.delete(music)
        db.commit()
        return True
    return False