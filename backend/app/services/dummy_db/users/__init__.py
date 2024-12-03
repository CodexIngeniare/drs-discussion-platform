from app import db
from .user_queries import get_user
from .user_queries import log_user 
from .user_queries import get_admins
from .user_queries import is_email_available
from .user_queries import register_new_user
from .user_queries import update_user_data
from .users_data import dummy_rusers

db.create_all()
db.session.add_all(dummy_rusers)
db.session.commit()