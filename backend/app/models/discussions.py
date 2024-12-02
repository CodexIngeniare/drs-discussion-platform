from app import db
from sqlalchemy.orm import relationship

class Discussion(db.Model):
    __tablename__ = 'discussions'  # Naziv tabele u bazi podataka

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('registered_users.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )

    # Relacije
    user = relationship("RegisteredUser", backref="discussions")
    topic = relationship("Topic", backref="discussions")

    def __repr__(self):
        return f"<Discussion {self.title}>"
