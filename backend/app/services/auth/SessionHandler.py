# services/auth/session_handler.py
import uuid
from flask import jsonify

class SessionHandler:
    def __init__(self):
        # Rečnik za čuvanje aktivnih sesija
        self.active_sessions = {}

    def create_session(self, user_id, email, is_admin):
        """
        Kreira novu sesiju za korisnika.
        - Proverava da li je korisnik već ulogovan.
        - Ako jeste, vraća grešku.
        - Ako nije, generiše token i čuva sesiju.
        """
        # Provera da li korisnik već ima aktivnu sesiju
        if any(session["email"] == email for session in self.active_sessions.values()):
            return jsonify({"error_code": "ALREADY_LOGGED_IN", "message": "User is already logged in."}), 403

        # Generisanje novog tokena
        token = str(uuid.uuid4())

        # Čuvanje sesije
        self.active_sessions[token] = {
            "user_id": user_id,
            "email": email,
            "permissions": "admin" if is_admin else "user"
        }

        return token

    def get_session(self, token):
        """
        Dohvata podatke sesije na osnovu tokena.
        - Ako token nije validan, vraća None.
        """
        session = self.active_sessions.get(token)
        if not session:
            print(f"Invalid token: {token}")  # Dodajte log za praćenje grešaka
        return session

    def logout(self, token):
        """
        Briše sesiju na osnovu tokena.
        """
        if token in self.active_sessions:
            del self.active_sessions[token]
            return True
        return False

    def is_user_logged_in(self, email):
        """
        Proverava da li je korisnik već ulogovan.
        """
        return any(session["email"] == email for session in self.active_sessions.values())
