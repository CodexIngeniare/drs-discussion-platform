from flask import Blueprint, request
from app.services.database import (
    get_admin_emails,
    get_all_pending_users, 
    get_all_registered_users, 
    approve_user, 
    get_user_by_email, 
    log_user_login,
    is_email_registered,
    register_new_user,
    update_user_data  # Dodali smo novu funkciju
)

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

# Logovanje korisnika - postavljanje trenutnog datuma i vremena poslednjeg logovanja
@db_bp.route('/db/log_user_login/<string:email>', methods=['POST'])
def db_log_user_login(email):
    try:
        user = log_user_login(email)
        if user is None:
            raise Exception(f"Korisnik sa emailom {email} nije pronađen.")

        # Vraća podatke o uspešnom logovanju
        return {
            "id": user.id,
            "username": user.username,
            "last_logged_in": user.last_logged_in
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

# Provera da li je email u upotrebi
@db_bp.route('/db/email_in_use/<string:email>', methods=['GET'])
def db_email_already_in_use(email):
    try:
        result = is_email_registered(email)
        return {"email_in_use": result}, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500


# Endpoint za registraciju novog korisnika
@db_bp.route('/db/register_new_user/<string:email>', methods=['POST'])
def db_register_new_user(email):
    try:
        form_data = request.get_json()  # Dobijamo podatke u JSON formatu iz tela zahteva
        user = register_new_user(email, form_data)
        
        if user is None:
            raise Exception(f"Email {email} je već u upotrebi ili je došlo do greške prilikom registracije.")

        # Uspešna registracija
        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "username": user.username
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    

@db_bp.route('/db/get_user_data/<string:email>', methods=['GET'])
def db_get_user_data(email):
    try:
        # Pozivamo funkciju koja pretražuje registrovane korisnike po email-u
        user = get_user_by_email(email)
        if user is None:
            return {"user_data": None}, 200
        
        # Vraćamo podatke o korisniku
        return {
            "user_data": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "username": user.username,
                "last_logged_in": user.last_logged_in,
                "is_admin" : user.is_admin
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500




# Ažuriranje podataka korisnika
@db_bp.route('/db/update_user_data/<string:email>', methods=['POST'])
def db_update_user_data(email):
    try:
        form_data = request.get_json()  # Preuzimamo podatke iz POST zahteva
        user = update_user_data(email, form_data)
        if not user:
            raise Exception(f"Korisnik sa emailom {email} nije pronađen.")
        
        # Vraćamo ažurirane podatke korisnika (iz objekta u rečnik)
        return {
            "status": "success",
            "user_data": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "username": user.username,
                "last_logged_in": user.last_logged_in
            }
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
    

    # Dohvatanje svih email-ova admina
@db_bp.route('/db/get_all_admin_emails', methods=['GET'])
def db_get_all_admin_emails():
    try:
        # Pozivamo funkciju koja vraća sve email adrese admina
        admin_emails = get_admin_emails()
        
        if not admin_emails:
            raise Exception("Došlo je do greške prilikom dohvatanja email adresa admina.")

        # Vraćamo listu email adresa
        return {"admin_emails": admin_emails}, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
