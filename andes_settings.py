mysqldata = 'root:1234@localhost:3306/andesflask'
myPort = 5010

db_folder = 'andes.db'
user_file = 'andes.db.User'
custom_folder = 'andes'
template_folder = 'andes/templates'
static_folder = 'andes/static'

templates = {
'loggin_template':'mylogin.html',
'navbar_template':'mynavbar.html',
'sidebar_template':'mysidebar.html',
'footer_template':'myfooter.html',
'container_template':'mycontainer.html',
'home_template':'home.html'}

app_name = "Andes Lineas Aereas"
images_url = 'andes/files'
SECRET_KEY = 'andes_3883'

versions = {}

AccountName = 'Andes Soporte'
Sender = 'soporte@andes.com'
SMTPServer = 'smtp-relay.gmail.com'
SMTPPort = 25

def getMyFunction(function,params):
    from andes.main import getMyFunction as myFunction
    return myFunction(function,params)

def getModules(UserType):
    from andes.main import getModules as modules
    return modules(UserType)

from andes.main import blue_andes as custom_app
