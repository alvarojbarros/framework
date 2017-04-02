import mail

def sendPasswordRecoverMail(email,newpwd,userid):
    msj = "\n"
    msj += "Su nombre de usuario es: %s\n" % userid
    msj += "Su nuevo password es: %s\n" % newpwd
    msj += "\n"
    return mail.sendMail(email,'Recuperación de Password',msj)
