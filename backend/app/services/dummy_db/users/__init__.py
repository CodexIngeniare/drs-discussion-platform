from app import db
from .user_queries import get_user_by_email
from .user_queries import get_user_by_username
from .user_queries import log_user 
from .user_queries import get_admin_emails
from .user_queries import is_email_taken
from .user_queries import is_username_taken
from .user_queries import register_new_user
from .user_queries import update_user_data
from .users_data import dummy_rusers

db.create_all()
db.session.add_all(dummy_rusers)
db.session.commit()