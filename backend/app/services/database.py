from app import db
from app.models.pending_users import PendingUser
from app.models.registered_users import RegisteredUser
from sqlalchemy.exc import SQLAlchemyError

def approve_user(user_id):
    """
    Prebacuje korisnika iz `pending_users` u `registered_users`.
    """
    try:
        user = PendingUser.query.get(user_id)
        if not user:
            return None

        # Kreiraj novog korisnika u `registered_users`
        new_user = RegisteredUser(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            username=user.username,
            password_hash=user.password_hash  # Koristi password_hash
        )
        db.session.add(new_user)
        db.session.delete(user)  # Obriši korisnika iz `pending_users`
        db.session.commit()
        return new_user
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None

def get_all_pending_users():
    """ Dohvata sve korisnike koji čekaju odobrenje """
    try:
        return PendingUser.query.all()
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None

def get_all_registered_users():
    """ Dohvata sve odobrene korisnike """
    try:
        return RegisteredUser.query.all()
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None
