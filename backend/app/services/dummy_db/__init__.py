from app import db

def initialize_dummy_db():
    try:
        from .users import dummy_registered_users, dummy_pending_users
        from .topics import dummy_topics
        from .discussions import dummy_discussions
        from .comments import dummy_comments
        db.create_all()
        db.session.add_all(dummy_registered_users)
        db.session.add_all(dummy_pending_users)
        db.session.add_all(dummy_topics)
        db.session.add_all(dummy_discussions)
        db.session.add_all(dummy_comments)
        db.session.commit()
        print("[SYSTEM] dummy db initialized")
    except Exception as e:
        print(f"[SYSTEM] dummy db initialization failed {e}")