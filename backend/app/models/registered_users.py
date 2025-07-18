from app import db

class RegisteredUser(db.Model):
    __tablename__ = 'registered_users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)  # Ovdje koristiš password_hash
    phone_number = db.Column(db.String(15))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    country = db.Column(db.String(100))
    last_logged_in = db.Column(db.DateTime, default=None)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    first_login = db.Column(db.Boolean, default=True, nullable=False)

    def __repr__(self):
        return f'<RegisteredUser {self.username}>'
