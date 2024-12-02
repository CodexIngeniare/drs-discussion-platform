from app import db
from sqlalchemy.orm import relationship

class Comment(db.Model):
    __tablename__ = 'comments'  # Naziv tabele u bazi podataka

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('registered_users.id'), nullable=False)
    discussion_id = db.Column(db.Integer, db.ForeignKey('discussions.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )

    # Relacije
    user = relationship("RegisteredUser", backref="comments")
    discussion = relationship("Discussion", backref="comments")

    def __repr__(self):
        return f"<Comment by User {self.user_id} on Discussion {self.discussion_id}>"
