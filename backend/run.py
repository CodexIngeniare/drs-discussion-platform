from app import create_app, db
from app.models import User, PendingUser, RegisteredUser, Comment, Discussion, Like, Notification, Topic
from app.services.admin import initialize_admin_user


app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Kreira tabele ako ne postoje
        initialize_admin_user()
    app.run(host='0.0.0.0', port=5000, debug=True)

