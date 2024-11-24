from flask import Flask

def create_app():

    app = Flask(__name__)

    # Load app config
    # NOTE: za flask app config promenljive nije potrebno, mogu se sve ucitati iz .flaskenv komandom: flask run
    from .config import DevelopmentConfig
    app.config.from_object(DevelopmentConfig)

    # Register REST endpoints
    from .routes import home_bp
    app.register_blueprint(home_bp)

    # TODO: dodati jos endpoint-ova

    # TODO: Ostvariti konekciju sa bazom podataka

    return app
