from app.models import db, User
from werkzeug.security import generate_password_hash

def add_dummy_data():
    dummy_users = [
        {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'username': 'john_doe',
            'password': 'password123',
            'phone_number': '123-456-7890',
            'address': '123 Main St',
            'city': 'Cityville',
            'country': 'Countryland'
        },
        {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane.smith@example.com',
            'username': 'jane_smith',
            'password': 'password123',
            'phone_number': '987-654-3210',
            'address': '456 Another St',
            'city': 'Townsville',
            'country': 'Countryland'
        }
    ]
    
    # Dodaj podatke ako još nisu u bazi
    for user_data in dummy_users:
        if not User.query.filter_by(email=user_data['email']).first():
            user = User(
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                email=user_data['email'],
                username=user_data['username'],
                password=generate_password_hash(user_data['password'], method='sha256'),
                phone_number=user_data['phone_number'],
                address=user_data['address'],
                city=user_data['city'],
                country=user_data['country']
            )
            db.session.add(user)
    db.session.commit()
    print("Dummy data added successfully!")
