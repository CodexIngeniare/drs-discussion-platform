from flask import Blueprint, jsonify

home_bp = Blueprint('home_bp', __name__)

@home_bp.route('/', methods=['GET'])
def home():
    # NOTE: ovo je privremeni endpoint namenjen za demonstraciju i proveru rada aplikacije
    
    data = {
        'message': 'salve ingeniares!',
        'status': 'success'
    }

    return jsonify(data)
    