from app.models import RegisteredUser

dummy_rusers = [
    RegisteredUser(
    id = 0,
    first_name = 'Ad',
    last_name = 'Min',
    email = 'nikola.rapidfire@gmail.com',
    username = 'Ad-min',
    password_hash = 'NekiHash',
    is_admin = True,
    ),
    RegisteredUser(
    id = 1,
    first_name = 'Defan',
    last_name = 'Sangubic',
    email = 'def.san@gmail.com',
    username = 'DefanSangubic',
    password_hash = 'NekiHash',
    ),
    RegisteredUser(
    id = 2,
    first_name = 'Maresh',
    last_name = 'Jugovic',
    email = 'juzni.vetar.fan@gmail.com',
    username = 'MareshJug',
    password_hash = 'NekiHash',
    ),
    RegisteredUser(
    id = 3,
    first_name = 'Pazar',
    last_name = 'Lopovic',
    email = 'razal@gmail.com',
    username = 'PazLopov',
    password_hash = 'NekiHash',
    )
]