from flask import Flask
from flask_mail import Mail
from .config import DevelopmentConfig
from .models import db  # Ovo sada koristi db iz models, koji je definisan bez uvođenja iz app
from flask_cors import CORS

mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    CORS(app)
    
    # Inicijalizacija baze podataka i mail servisa
    db.init_app(app)
    mail.init_app(app)
    
    # Registracija blueprinta
    from app.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    
    # Inicijalizacija baze i dummy podataka
    with app.app_context():
        db.create_all()  # Kreira tabele
        from backend.app.users import add_dummy_data
        add_dummy_data()  # Dodaje dummy podatke
    
    return app
