from app import db
from sqlalchemy.orm import relationship

class Like(db.Model):
    __tablename__ = 'likes'  # Naziv tabele u bazi podataka

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('registered_users.id'), nullable=False)
    discussion_id = db.Column(db.Integer, db.ForeignKey('discussions.id'), nullable=False)
    is_like = db.Column(db.Boolean, nullable=False)  # True za like, False za dislike
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relacije
    user = relationship("RegisteredUser", backref="likes")
    discussion = relationship("Discussion", backref="likes")

    __table_args__ = (db.UniqueConstraint('user_id', 'discussion_id', name='unique_user_discussion_like'),)

    def __repr__(self):
        return f"<Like by User {self.user_id} on Discussion {self.discussion_id}>"
