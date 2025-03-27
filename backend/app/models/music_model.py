from app import db

class Music(db.Model):
    __tablename__ = 'music'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    s3_url = db.Column(db.String(255), nullable=False)

    library = db.relationship('Library', back_populates='music')

    def __repr__(self):
        return f"<Music(id={self.id}, title={self.title}, artist={self.artist})>"
