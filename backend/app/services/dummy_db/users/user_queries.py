from datetime import datetime
from app.models import RegisteredUser, PendingUser
from app.services.dummy_db.users import db

def get_user(email):
    user = None
    try:
        user = RegisteredUser.query.filter_by(email=email).first()
    except Exception:
        return None
    
    return user

def log_user(email):
    user = None

    try:
        user = RegisteredUser.query.filter_by(email=email).first()
    except Exception:
        return None

    if user is None:
        return False
    
    user.last_logged_in = datetime.utcnow()
    db.session.commit()
    return True

def get_admins():
    admins = None

    try:
        admins = RegisteredUser.query.filter_by(is_admin = True).all()
    except Exception:
        return None
    
    return admins

def is_email_available(email):
    user = get_user(email)

    if user is not None:
        return False
    
    return True

def register_new_user(email, user_data):
    new_user = PendingUser(
        email = email,
        first_name = user_data.first_name,
        last_name = user_data.last_name,
        username = user_data.username,
        password_hash = user_data.password_hash,
        phone_number = user_data.phone_number,
        address = user_data.address,
        city = user_data.city,
        country = user_data.country,
        registration_status = user_data.registration_status,
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception:
        return False
    
    return True

def update_user_data(email, user_data):
    user = get_user(email)

    if user is None:
        return False
    
    user.first_name = user_data.first_name
    user.last_name = user_data.last_name
    user.username = user_data.username
    user.password_hash = user_data.password_hash
    user.phone_number = user_data.phone_number
    user.address = user_data.address
    user.city = user_data.city
    db.session.commit()
    return True