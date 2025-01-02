from app.models import PendingUser

dummy_pending_users = [
    PendingUser(
    first_name = 'Kuk',
    last_name = 'Varadzica',
    email = 'kuk.varadzic@gmail.com',
    username = 'KukVaradzic',
    password_hash = '332d0d385c22af74dded9899c4d29dcb$1abd2d61505e650fa1809c9e4b5c2af19246fc4b6ee637ac4af4bcb4b90043c6',
    phone_number = '0651234567',
    country = 'Serbia',
    city = 'Trsic',
    address = 'Neka adresa 123',
    ),
    PendingUser(
    first_name = 'Marcus',
    last_name = 'Antonius',
    email = 'marcus.antonius@gmail.com',
    username = 'MarcusAntonius',
    password_hash = '332d0d385c22af74dded9899c4d29dcb$1abd2d61505e650fa1809c9e4b5c2af19246fc4b6ee637ac4af4bcb4b90043c6',
    phone_number = '0651234567',
    country = 'Roman Empire',
    city = 'Ostia',
    address = 'Neka adresa 123',
    ),
]