from app.models import Discussion

dummy_discussions = [
    Discussion(
        title="Adeptus Astartes Legions",
        content="Comment your space marine legion!",
        user_id=1,
        topic_id=2,
    ),
    Discussion(
        title="Null Pointer",
        content="How dangerous are null pointers.",
        user_id=1,
        topic_id=3,
    ),
    Discussion(
        title="What if Julius Ceasar was not assassinated",
        content="How would Roman empire evolve if Julius Ceaser never got killed.",
        user_id=1,
        topic_id=4,
    ),
    Discussion(
        title="YUGO car",
        content="Can i travel with YUGO accross the globe.",
        user_id=2,
        topic_id=6,
    ),
]