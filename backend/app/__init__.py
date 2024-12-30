from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


db = SQLAlchemy()
migrate = Migrate()



def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    # Konfiguracija baze
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:my-secret-pw@localhost:3307/docker_mysql_db'
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # NOTE: URI za dummy_db
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicijalizacija baze podataka i migracija
    db.init_app(app)
    migrate.init_app(app, db)

    #with app.app_context():    # NOTE: dummy_db
    #    from app.services.dummy_db import initialize_dummy_db
    #    initialize_dummy_db()

    from app.routes import home_bp
    app.register_blueprint(home_bp)
    
    from app.routes import auth_bp
    app.register_blueprint(auth_bp)

    # Registracija ruta
    from app.routes.db_test import db_bp  # Uvozimo db_bp koji sadrži testne rute za bazu
    app.register_blueprint(db_bp)

    from app.routes import admin_bp
    app.register_blueprint(admin_bp)

    from app.services.admin.extensions import socketio
    socketio.init_app(app, cors_allowed_origins="*")

    from app.routes import discussion_bp
    app.register_blueprint(discussion_bp)

    from app.routes import comment_bp
    app.register_blueprint(comment_bp)
    

    

    return app
