import hashlib
import os

class PasswordHasher:
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hešira lozinku koristeći SHA-256 i vraća heš.

        :param password: Lozinka u običnoj formi
        :return: Heširana lozinka kao string
        """
        if not password:
            raise ValueError("Password cannot be empty.")
        
        # Generišemo salt (randomni niz bajtova)
        salt = os.urandom(16)
        
        # Kreiramo heš koristeći salt i SHA-256
        password_hash = hashlib.sha256(salt + password.encode('utf-8')).hexdigest()
        
        # Vraćamo salt i heš kao jedan string, za kasniju verifikaciju
        return f"{salt.hex()}${password_hash}"

    @staticmethod
    def verify_password(stored_password: str, input_password: str) -> bool:
        """
        Proverava da li se unesena lozinka podudara sa heširanom lozinkom iz baze.

        :param stored_password: Heširana lozinka iz baze podataka (salt$heš)
        :param input_password: Lozinka u običnoj formi uneta od strane korisnika
        :return: True ako se podudaraju, False inače
        """
        if not stored_password or not input_password:
            return False
        
        # Razdvajanje salt i heša sa formata salt$heš
        salt, stored_hash = stored_password.split('$')
        salt = bytes.fromhex(salt)
        
        # Generišemo heš za unesenu lozinku koristeći isti salt
        input_hash = hashlib.sha256(salt + input_password.encode('utf-8')).hexdigest()
        
        # Proveravamo da li se generisani heš podudara sa onim u bazi
        return stored_hash == input_hash