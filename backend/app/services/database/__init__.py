# Import funkcija iz user_queries.py
from .user_queries import (
    approve_user,
    get_all_pending_users,
    get_all_registered_users,
    get_user_by_email,
    log_user_login,
    is_email_registered,
    is_username_registered,
    register_new_user,
    update_user_data,
    get_admin_emails,
    remove_pending_user,
    get_user_by_username
)

from .topic_queries import (
    create_topic,
    update_topic,
    delete_topic,
    get_all_topics,
    get_topic_by_id,
    create_default_topic,
    get_topic_by_name
)

from .discussions_queries import (
    create_discussion,
    update_discussion,
    delete_discussion,
    get_all_discussions,
    get_discussion_by_id,
    search_discussions,
    get_vote_status
)

from .comments_queries import (
    create_comment,
    delete_comment,
    get_all_comments,
    get_comment_by_id,
    get_comments_by_discussion_id
)

from .likes_queries import(
    like_or_dislike
)


