from flask import Blueprint, request, jsonify
from app.services.auth.register import register_user
from app.services.auth.login import login_user
from app.services.auth.logout import logout_user

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Route for user login.
    Expects JSON body with `email` and `password`.
    Returns a token on success or an error message on failure.
    """
    try:
        # Читање података из захтева
        data = request.get_json()

        # Валидација улазних података
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error_code": "INVALID_REQUEST", "message": "Email and password are required."}), 400

        # Позив функције за логовање корисника
        response, status_code = login_user(data['email'], data['password'])

        # Враћање одговора од `login_user`
        return response, status_code

    except Exception as e:
        # Враћање грешке у случају изузетка
        return jsonify({"error": "SERVER_ERROR", "message": str(e)}), 500



@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Route for user logout.
    Expects JSON body with `token`.
    Deletes the session if token is valid.
    """
    try:
        data = request.get_json()
        if not data or 'token' not in data:
            return jsonify({"error_code": "INVALID_REQUEST"}), 400
        
        response, status_code = logout_user(data['token'])
        return response, status_code
    except Exception as e:
        return jsonify({"error": "SERVER_ERROR", "message": str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Ruta za registraciju korisnika.
    Prima JSON podatke iz tela zahteva, validira ih i registruje korisnika.
    """
    try:
        # Dobavljanje podataka iz POST zahteva (JSON format)
        form_data = request.get_json()

        

        if not form_data:
            return jsonify({
                "error": "INVALID_REQUEST",
                "message": "Nedostaju podaci u zahtevu."
            }), 400

        # Pozivanje funkcije za registraciju korisnika
        response , status_code = register_user(form_data)
        #Vracanje odgovora na osnovu razultata registracije
        return response, status_code

    except Exception as e:       
        return jsonify({
            "error": "SERVER_ERROR",
            "message": f"Došlo je do greške: {str(e)}"
        }),500