from app import db
from sqlalchemy.orm import relationship

class Notification(db.Model):
    __tablename__ = 'notifications'  # Naziv tabele u bazi podataka

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('registered_users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)  # False za nepročitano
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relacije
    user = relationship("RegisteredUser", backref="notifications")

    def __repr__(self):
        return f"<Notification for User {self.user_id}>"
