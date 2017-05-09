# -*- coding: utf-8 -*-

def sendMail(email,subject,message):
    from flaskmail import sendFlaskMail
    sendFlaskMail(email,subject,message)
