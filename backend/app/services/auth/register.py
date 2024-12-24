from app.services.database import is_email_registered, is_username_registered, register_new_user
from app.services.auth.password_hasher import PasswordHasher
from flask import jsonify
from app.services.admin.extensions import socketio


def register_user(form_data):
    """
    Registruje korisnika ako su svi podaci validni.
    Obavezna polja: email, username, password, first_name, last_name.
    Ostala dodatna polja: phone_number, address, city, country.
    """
    try:
        # Sakupljanje grešaka
        errors = {}

        if not form_data.get('email', '').strip():
            errors["email_error"] = "EMAIL_NULL"
        if not form_data.get('username', '').strip():
            errors["username_error"] = "USERNAME_NULL"
        if not form_data.get('password', '').strip():
            errors["password_error"] = "PASSWORD_NULL"
        if not form_data.get('first_name', '').strip():
            errors["first_name_error"] = "FIRST_NAME_NULL"
        if not form_data.get('last_name', '').strip():
            errors["last_name_error"] = "LAST_NAME_NULL"

        # Provera registracije za email i username
        if form_data.get('email', '').strip() and is_email_registered(form_data['email']):
            errors["email_error"] = "EMAIL_ALREADY_REGISTERED"
        if form_data.get('username', '').strip() and is_username_registered(form_data['username']):
            errors["username_error"] = "USERNAME_ALREADY_REGISTERED"

        # Ako postoje greške, vrati ih
        if errors:
            return jsonify(errors), 400

        # Priprema podataka korisnika
        user_data = {
            "first_name": form_data["first_name"].strip(),
            "last_name": form_data["last_name"].strip(),
            "email": form_data["email"].strip(),
            "username": form_data["username"].strip(),
            "password_hash": PasswordHasher.hash_password(form_data['password']),  # Hesiraj lozinku
            "phone_number": form_data.get("phone_number", "").strip(),
            "address": form_data.get("address", "").strip(),
            "city": form_data.get("city", "").strip(),
            "country": form_data.get("country", "").strip()
      
        }

        # Pozivanje funkcije za registraciju
        result = register_new_user(user_data["email"], user_data)

        # Provera da li je registracija uspela
        if result is None:
            return jsonify({"server_error": "REGISTRATION_FAILED"}), 400
        
        # Emitovanje novog korisnika prema svim adminima
        socketio.emit('new_pending_user', user_data, namespace='/admin', broadcast=True)

        # Uspešna registracija
        return '', 201  # Vraća samo status 201 bez dodatnih podataka

    except Exception as e:
        return jsonify({"server_error": "REGISTRATION_FAILED"}),400
    


def validate_form_data(form_data, current_email, current_username, user):
    """
    Validira podatke za ažuriranje korisničkih informacija.
    - Proverava jedinstvenost email-a i username-a.
    - Validira lozinku (stara i nova ako se menja).
    - Proverava obavezna i opcionalna polja.

    :param form_data: Podaci poslati u zahtevu.
    :param current_email: Trenutni email korisnika.
    :param current_username: Trenutni username korisnika.
    :param user: Trenutni objekat korisnika (sačuvan u bazi).

    :return: Tuple (bool, dict) gde bool označava validnost podataka, a dict sadrži validirane podatke ili grešku.
    """
    try:
        updated_data = {}

        # Validacija email-a
        if "email" in form_data:
            email = form_data["email"].strip()
            if not email:
                return False, {"status": "error", "message": "Email cannot be empty."}
            if email != current_email and is_email_registered(email):
                return False, {"status": "error", "message": "Email already exists."}
            updated_data["email"] = email

        # Validacija username-a
        if "username" in form_data:
            username = form_data["username"].strip()
            if not username:
                return False, {"status": "error", "message": "Username cannot be empty."}
            if username != current_username and is_username_registered(username):
                return False, {"status": "error", "message": "Username already exists."}
            updated_data["username"] = username

        # Validacija lozinke (stara i nova lozinka)
        if "old_password" in form_data and "new_password" in form_data:
            old_password = form_data["old_password"].strip()
            new_password = form_data["new_password"].strip()

            if not old_password or not new_password:
                return False, {"status": "error", "message": "Old password and new password are required."}

            # Provera da li stara lozinka odgovara
            if not PasswordHasher.verify_password(user.password_hash, old_password):
                return False, {"status": "error", "message": "Old password is incorrect."}

            # Hesiranje nove lozinke
            hashed_new_password = PasswordHasher.hash_password(new_password)
            updated_data["password_hash"] = hashed_new_password

        elif "old_password" in form_data or "new_password" in form_data:
            # Ako je poslat samo jedan od parametara za lozinku, vraćamo grešku
            return False, {"status": "error", "message": "Both old and new passwords are required to update the password."}

        # Validacija obaveznih polja (first_name i last_name)
        required_fields = ["first_name", "last_name"]
        for field in required_fields:
            if field in form_data:
                value = form_data[field].strip()
                if not value:
                    return False, {"status": "error", "message": f"{field.replace('_', ' ').capitalize()} cannot be empty."}
                updated_data[field] = value

        # Validacija opcionalnih polja (phone_number, address, city, state, country)
        optional_fields = ["phone_number", "address", "city", "state", "country"]
        for field in optional_fields:
            if field in form_data:
                updated_data[field] = form_data[field].strip()

        return True, updated_data

    except Exception as e:
        return False, {"status": "error", "message": f"Validation error:{str(e)}"}