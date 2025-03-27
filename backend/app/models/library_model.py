from app import db

class Library(db.Model):
    __tablename__ = 'library'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    music_id = db.Column(db.Integer, db.ForeignKey('music.id'), nullable=False)

    # Use string references to avoid circular import
    user = db.relationship('User', back_populates='library')
    music = db.relationship('Music', back_populates='library')

    music = db.relationship("Music")

    def __repr__(self):
        return f"<Library(id={self.id}, user_id={self.user_id}, music_id={self.music_id})>"
