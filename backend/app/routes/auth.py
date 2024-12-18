from flask import Blueprint, request, jsonify
from app.services.auth.register import register_user, validate_form_data
from app.services.auth.login import login_user, get_user_data
from app.services.auth.logout import logout_user
from app.services.auth import session_handler
from app.services.database import get_user_by_email, update_user_data

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
    

@auth_bp.route('/user_data', methods=['GET'])
def user_data():
    """
    Dohvata podatke o korisniku na osnovu tokena.
    """
    try:
        # Dobijanje tokena iz hedera Authorization
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Poziv funkcije za dohvat podataka
        response, status_code = get_user_data(user_token)
        return response, status_code

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message": str(e)}), 500



@auth_bp.route('/update_user_data', methods=['PUT'])
def update_user_data_route():
    """
    Ažurira korisničke podatke na osnovu prosleđenog tokena i forme.
    """
    try:
        # Dohvati token iz hedera
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error_code": "MISSING_TOKEN", "message": "Token is required."}), 400

        # Proveri validnost tokena
        session_data = session_handler.get_session(user_token)
        if not session_data:
            return jsonify({"error_code": "UNAUTHORIZED", "message": "Invalid or expired token."}), 401

        # Dobavi email iz sesije
        email = session_data.get("email")
        if not email:
            return jsonify({"error_code": "INVALID_SESSION", "message": "Session data is incomplete."}), 400

        # Dobavi podatke iz zahteva (form_data)
        form_data = request.get_json()
        if not form_data:
            return jsonify({"error_code": "INVALID_DATA", "message": "No data provided."}), 400

        # Dohvati trenutnog korisnika
        user = get_user_by_email(email)
        if not user:
            return jsonify({"error_code": "USER_NOT_FOUND", "message": "User not found."}), 404

        # Validacija forme
        is_valid, result = validate_form_data(form_data, user.email, user.username, user)
        if not is_valid:
            return jsonify(result), 400  # Ako validacija ne uspe, šalje grešku

        # Ažuriraj korisničke podatke
        update_result = update_user_data(user.email, result)
        if not update_result:
            return jsonify({"error_code": "UPDATE_FAILED", "message": "Failed to update user data."}), 500

        # Ako je email ažuriran, promeni ga i u sesiji
        if "email" in result:
            session_data["email"] = result["email"]  # Direktno menjanje email-a u sesiji

        return jsonify({"message": "User data updated successfully."}),200

    except Exception as e:
        return jsonify({"error_code": "SERVER_ERROR", "message":str(e)}),500


