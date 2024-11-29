from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes


    # Register REST endpoints
    from .routes import home_bp
    app.register_blueprint(home_bp)

    # TODO: dodati jos endpoint-ova

    # TODO: Ostvariti konekciju sa bazom podataka

    return app
