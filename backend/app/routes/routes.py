from flask import Blueprint, jsonify
from app.models.models import User  # Importuj User iz ispravnog modula

home_bp = Blueprint('home_bp', __name__)

@home_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()  # Dohvatanje svih korisnika
    users_list = [
        {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "username": user.username,
            "registration_status": user.registration_status
        } for user in users
    ]
    return jsonify(users_list)
