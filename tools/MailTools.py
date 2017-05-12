# -*- coding: utf-8 -*-
from mail import sendMail

def sendPasswordRecoverMail(email,newpwd,userid):
    msj = "\n"
    msj += "Su nombre de usuario es: %s\n" % userid
    msj += "Su nuevo password es: %s\n" % newpwd
    msj += "\n"
    return sendFlankMail(email,'Donde Fluir: Recuperar Password',msj)

