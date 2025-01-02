from app import db
from app.models.pending_users import PendingUser
from app.models.registered_users import RegisteredUser
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

def approve_user(user_id):
    """
    Prebacuje korisnika iz `pending_users` u `registered_users`.
    """
    try:
        user = PendingUser.query.get(user_id)
        if not user:
            return None

        # Kreiraj novog korisnika u `registered_users`
        new_user = RegisteredUser(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            username=user.username,
            password_hash=user.password_hash,  # Koristi password_hash
            phone_number=user.phone_number,
            country=user.country,
            city=user.city,
            address=user.address
        )
        db.session.add(new_user)
        db.session.delete(user)  # Obriši korisnika iz `pending_users`
        db.session.commit()
        return new_user
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None


def remove_pending_user(user_id):
    """
    Uklanja korisnika iz tabele PendingUsers na osnovu ID-a.

    :param user_id: ID korisnika koji se uklanja.
    :return: Objekat korisnika ako je uspešno uklonjen, None inače.
    """
    try:
        # Pretpostavimo da koristimo ORM poput SQLAlchemy
        user = PendingUser.query.filter_by(id=user_id).first()
        if not user:
            return None
        db.session.delete(user)
        db.session.commit()
        return user
    except Exception as e:
        db.session.rollback()
        raise e


def get_all_pending_users():
    """ Dohvata sve korisnike koji čekaju odobrenje """
    try:
        pending_users =  PendingUser.query.all()
        return [user.to_dict() for user in pending_users]
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None

def get_all_registered_users():
    """ Dohvata sve odobrene korisnike """
    try:
        return RegisteredUser.query.all()
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None

def get_user_by_email(email):
    """ Dohvata podatke o korisniku na osnovu emaila """
    try:
        return RegisteredUser.query.filter_by(email=email).first()
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return None

def log_user_login(email):
    """
    Postavlja trenutni datum i vreme kao poslednje logovanje korisnika
    """
    try:
        user = RegisteredUser.query.filter_by(email=email).first()
        if not user:
            return None
        
        user.last_logged_in = datetime.now()
        db.session.commit()
        return user
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None

def is_email_registered(email):
    """
    Proverava da li je email već u upotrebi u tabeli odobrenih i neodobrenih korisnika.
    :param email: Email adresa koja se proverava.

    :return: True ako je email već u upotrebi, False u suprotnom.
    """
    try:
        reg_user_with_email = RegisteredUser.query.filter_by(email=email).first()
        if reg_user_with_email is None:
            pen_user_with_email = PendingUser.query.filter_by(email=email).first()
            if pen_user_with_email is None:
                return False
        
        return True
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return True
    
def is_username_registered(username):
    """
    Proverava da li je username već u upotrebi u tabeli odobrenih i neodobrenih korisnika.
    :param username: Korisnicko ime koja se proverava.

    :return: True ako je username već u upotrebi, False u suprotnom.
    """
    try:
        reg_user_with_username = RegisteredUser.query.filter_by(username=username).first()
        if reg_user_with_username is None:
            pen_user_with_username = PendingUser.query.filter_by(username=username).first()
            if pen_user_with_username is None:
                return False
        
        return True
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return True
    

# Funkcija za registraciju novog korisnika
def register_new_user(email, form_data):
    """
    Registruje novog korisnika na osnovu prosleđenog email-a i podataka (form_data).
    """
    try:

       # Provera da li je email već u upotrebi
        if is_email_registered(email) == True:
            return None  # Email već postoji, korisnik se ne registruje
       
        # Kreiranje novog korisnika i dodavanje u bazu
        new_user = PendingUser(
            first_name=form_data['first_name'],
            last_name=form_data['last_name'],
            email=email,
            username=form_data['username'],
            password_hash=form_data['password_hash'],  # Hashovana lozinka
            phone_number=form_data.get('phone_number', None),  # Opcionalno polje
            address=form_data.get('address', None),  # Opcionalno polje
            city=form_data.get('city', None),  # Opcionalno polje
            country=form_data.get('country', None)  # Opcionalno polje

        )

        db.session.add(new_user)
        db.session.commit()
        return new_user
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None
    
def update_user_data(email, form_data):
    """
    Ažurira podatke o korisniku na osnovu email-a i prosleđenih podataka (form_data).
    form_data je rečnik koji može sadržavati jedan ili više atributa korisnika.
    """
    try:
        user = get_user_by_email(email)  # Dohvata korisnika prema emailu
        if not user:
            return None  # Ako korisnik nije pronađen, vraćamo None

        # Prolazimo kroz svaki ključ u form_data i ažuriramo podatke
        for key, value in form_data.items():
            if key == "is_admin":
                raise ValueError("Atribut 'is_admin' ne može biti promenjen.")  # Ne dozvoljava promena is_admin

            if hasattr(user, key):  # Proveravamo da li korisnik ima atribut sa tim imenom
                setattr(user, key, value)  # Ažuriramo atribut
            else:
                raise ValueError(f"Atribut '{key}' nije validan za korisnika.")

        # Sačuvamo promene u bazi
        db.session.commit()

        # Vraćamo objekat korisnika nakon ažuriranja
        return user  # Ovdje vraćamo korisnika, a ne rečnik
    except ValueError as e:
        return {"status": "error", "message": str(e)}
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return {"status": "error", "message": "Greška prilikom ažuriranja podataka"}
    
def get_admin_emails():
    """
    Dohvata listu email-ova svih admina.
    """
    try:
        # Dohvata sve korisnike koji su admini
        admin_emails = [user.email for user in RegisteredUser.query.filter_by(is_admin=True).all()]
        return admin_emails
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return []
