from ..models.music_model import Music

def get_all_music():
    """
    Fetch all music tracks.
    """
    return Music.query.all()

def play_music(track_id: int):
    """
    Play a specific music track.
    """
    music = Music.query.filter_by(id=track_id).first()
    if music:
        return {"message": "Playing music", "s3_url": music.s3_url}
    return {"message": "Music not found"}

def pause_music():
    """
    Pause the currently playing music.
    """
    return {"message": "Music paused"}

def change_music(track_id: int):
    """
    Change the currently playing music.
    """
    music = Music.query.filter_by(id=track_id).first()
    if music:
        return {"message": "Music changed", "s3_url": music.s3_url}
    return {"message": "Music not found"}
