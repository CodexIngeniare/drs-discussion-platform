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

def get_admin_emails():
    admin_emails = []

    try:
        admins = RegisteredUser.query.filter_by(is_admin = True).all()
        for admin in admins:
            admin_emails.append(admin.email)
    except Exception:
        return []
    
    return admin_emails

def is_email_available(email):
    user = get_user(email)

    if user is not None:
        return False
    
    return True

def register_new_user(email, user_data):
    try:
        new_user = PendingUser(
            email = email,
            first_name = user_data["first_name"],
            last_name = user_data["last_name"],
            username = user_data["username"],
            password_hash = user_data["password_hash"],
            phone_number = user_data["phone_number"],
            address = user_data["address"],
            city = user_data["city"],
            country = user_data["country"],
            registration_status = "pending",
        )
        db.session.add(new_user)
        db.session.commit()
    except Exception:
        return False
    
    return True

def update_user_data(email, user_data):
    try:
        user = get_user(email)

        if user is None:
            return False
    
        if user_data.get("first_name") is not None:
            user.first_name = user_data["first_name"]
        if user_data.get("last_name") is not None:
            user.last_name = user_data["last_name"]
        if user_data.get("username") is not None:
            user.username = user_data["username"]
        if user_data.get("password_hash") is not None:
            user.password_hash = user_data["password_hash"]
        if user_data.get("phone_number") is not None:
            user.phone_number = user_data["phone_number"]
        if user_data.get("address") is not None:
            user.address = user_data["address"]
        if user_data.get("city") is not None:
            user.city = user_data["city"]
        db.session.commit()
    except Exception:
        return False
    
    return True