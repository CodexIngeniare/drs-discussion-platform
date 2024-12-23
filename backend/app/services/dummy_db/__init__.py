from app import db

def initialize_dummy_db():
    try:
        from .users import dummy_rusers
        db.create_all()
        db.session.add_all(dummy_rusers)
        db.session.commit()
        print("[SYSTEM] dummy db initialized")
    except Exception as e:
        print(f"[SYSTEM] dummy db initialization failed {e}")