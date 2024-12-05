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
            password_hash=user.password_hash  # Koristi password_hash
        )
        db.session.add(new_user)
        db.session.delete(user)  # Obriši korisnika iz `pending_users`
        db.session.commit()
        return new_user
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Greška: {str(e)}")
        return None

def get_all_pending_users():
    """ Dohvata sve korisnike koji čekaju odobrenje """
    try:
        return PendingUser.query.all()
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
    Proverava da li je email već u upotrebi u tabeli registrovanih korisnika.
    :param email: Email adresa koja se proverava.
    :return: "yes" ako je email već u upotrebi, "no" u suprotnom.
    """
    try:
        existing_user = RegisteredUser.query.filter_by(email=email).first()
        return "yes" if existing_user else "no"
    except SQLAlchemyError as e:
        print(f"Greška: {str(e)}")
        return "no"
    

# Funkcija za registraciju novog korisnika
def register_new_user(email, form_data):
    """
    Registruje novog korisnika na osnovu prosleđenog email-a i podataka (form_data).
    """
    try:
        # Provera da li je email već u upotrebi
        if is_email_registered(email) == "yes":
            return None  # Email već postoji, korisnik se ne registruje

        # Kreiranje novog korisnika i dodavanje u bazu
        new_user = PendingUser(
            first_name=form_data['first_name'],
            last_name=form_data['last_name'],
            email=email,
            username=form_data['username'],
            password_hash=form_data['password_hash']  # Pretpostavljam da koristiš hashovanu lozinku
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

