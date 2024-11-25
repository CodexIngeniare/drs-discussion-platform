from flask import Flask

def create_app():

    app = Flask(__name__)

    # Register REST endpoints
    from .routes import home_bp
    app.register_blueprint(home_bp)

    # TODO: dodati jos endpoint-ova

    # TODO: Ostvariti konekciju sa bazom podataka

    return app
