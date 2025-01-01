from app.models import RegisteredUser

dummy_rusers = [
    RegisteredUser(
    first_name = 'Nikola',
    last_name = 'Petrovic',
    email = 'nikola.rapidfire@gmail.com',
    username = 'CodexIngeniare',
    password_hash = '332d0d385c22af74dded9899c4d29dcb$1abd2d61505e650fa1809c9e4b5c2af19246fc4b6ee637ac4af4bcb4b90043c6',
    phone_number = '0651234567',
    country = 'Serbia',
    city = 'Novi Sad',
    address = 'Neka adresa 123',
    is_admin = True,
    ),
    RegisteredUser(
    first_name = 'Milan',
    last_name = 'Milanovic',
    email = 'milan.milanovic@gmail.com',
    username = 'MilankoCar',
    password_hash = '332d0d385c22af74dded9899c4d29dcb$1abd2d61505e650fa1809c9e4b5c2af19246fc4b6ee637ac4af4bcb4b90043c6',
    phone_number = '0651234567',
    country = 'Serbia',
    city = 'Sremska Mitrovica',
    address = 'Neka adresa 123',
    is_admin = False,
    ),
]