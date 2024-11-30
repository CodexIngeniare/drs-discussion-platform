from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Konfiguracija baze
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:my-secret-pw@localhost:3307/docker_mysql_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicijalizacija baze podataka i migracija
    db.init_app(app)
    migrate.init_app(app, db)

    # Registracija ruta
    from app.routes.routes import home_bp  # Obrati pažnju na ispravan import
    app.register_blueprint(home_bp)

    return app
