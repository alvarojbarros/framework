import mail

def sendPasswordRecoverMail(email,newpwd,userid):
    msj = "\n"
    msj += "Su nombre de usuario es: %s\n" % userid
    msj += "Su nuevo password es: %s\n" % newpwd
    msj += "\n"
    return mail.sendMail(email,'Recuperación de Password',msj)

def sendMailNewActivity(email):
    msj = "\n"
    msj += "Tiene una nueva actividad Registrada"
    msj += "\n"
    msj += "Para ver su agenda ingrese a http://app.dondefluir.com"
    msj += "\n"
    return mail.sendMail(email,'Donde Fluir - Nueva Actividad registrada',msj)

def sendMailUpdateActivity(email):
    msj = "\n"
    msj += "Tiene Actividades Modificadas"
    msj += "\n"
    msj += "Para ver su agenda ingrese a http://app.dondefluir.com"
    msj += "\n"
    return mail.sendMail(email,'Donde Fluir - Actividad modificada',msj)
