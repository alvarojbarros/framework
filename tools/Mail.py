# -*- coding: utf-8 -*-

def sendMail(email,subject,message):
    from tools.FlaskMail import sendFlaskMail
    sendFlaskMail(email,subject,message)
