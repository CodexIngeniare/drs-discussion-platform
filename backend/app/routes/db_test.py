from flask import Blueprint
from app.services.database import get_all_pending_users, get_all_registered_users, approve_user

db_bp = Blueprint('db_bp', __name__)

# Dohvatanje svih korisnika koji čekaju odobrenje
@db_bp.route('/db/get_pending_users', methods=['GET'])
def db_get_pending_users():
    try:
        users = get_all_pending_users()
        if users is None:
            raise Exception("Došlo je do greške prilikom dohvatanja korisnika koji čekaju odobrenje.")

        # Vraća podatke kao obične objekte (Python objekti)
        return [{
            "id": user.id,
            "username": user.username,
            "registration_status": user.registration_status
        } for user in users], 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Dohvatanje svih registrovanih korisnika
@db_bp.route('/db/get_registered_users', methods=['GET'])
def db_get_registered_users():
    try:
        users = get_all_registered_users()
        if users is None:
            raise Exception("Došlo je do greške prilikom dohvatanja registrovanih korisnika.")

        # Vraća podatke kao obične objekte (Python objekti)
        return [{
            "id": user.id,
            "username": user.username,
            "last_logged_in": user.last_logged_in
        } for user in users], 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Odobravanje korisnika i prebacivanje u `registered_users`
@db_bp.route('/db/approve_user/<int:user_id>', methods=['POST'])
def db_approve_user(user_id):
    try:
        user = approve_user(user_id)
        if user is None:
            raise Exception(f"Korisnik sa ID {user_id} nije pronađen ili nije mogao biti odobren.")

        # Vraća podatke o uspešnom odobravanju kao objekat
        return {
            "id": user.id,
            "username": user.username
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
