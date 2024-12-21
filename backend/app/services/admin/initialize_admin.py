from app.models import RegisteredUser
from app import db

def initialize_admin_user():
    """
    Kreira admin korisnika ako ne postoji u bazi.
    """
    from app.services.auth.password_hasher import PasswordHasher  # Deferred import

    try:
         
        admin_email = "admin@gmail.com"
        admin_user = RegisteredUser.query.filter_by(email=admin_email).first()

        if not admin_user:
         
            new_admin = RegisteredUser(
                first_name="Admin",
                last_name="User",
                email=admin_email,
                username="admin",
                password_hash=PasswordHasher.hash_password("admin1234"),
                phone_number="1234567890",
                address="123 Admin Street",
                city="Admin City",
                state="Admin State",
                country="Admin Country",
                is_admin=True
            )
            db.session.add(new_admin)
            db.session.commit()
            
        else:
            print("Admin user already exists.")  
    except Exception as e:
        print(f"Error while adding admin user:{e}")

