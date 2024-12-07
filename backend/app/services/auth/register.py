from app.services.database import is_email_registered, is_username_registered, register_new_user
from werkzeug.security import generate_password_hash
from flask import jsonify


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
            "password_hash": generate_password_hash(form_data['password'], method='pbkdf2:sha256'),  # Hesiraj lozinku
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

        # Uspešna registracija
        return '', 201  # Vraća samo status 201 bez dodatnih podataka

    except Exception as e:
        return jsonify({"server_error": "REGISTRATION_FAILED"}),400