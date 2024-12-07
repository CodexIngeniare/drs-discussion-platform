from flask import Blueprint, request, jsonify
from app.services.auth.register import register_user

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    pass

@auth_bp.route('/logout', methods=['POST'])
def logout():
    pass

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