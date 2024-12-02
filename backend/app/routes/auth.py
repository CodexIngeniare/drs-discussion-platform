from flask import Blueprint, jsonify

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    pass

@auth_bp.route('/logout', methods=['POST'])
def logout():
    pass

@auth_bp.route('/register', methods=['POST'])
def register():
    pass