import smtplib
import getsettings
settings = getsettings.getSettings()
from tools.Tools import Error

def sendMail(email,subject,message):
    sender = settings.Sender
    receivers = [email]
    msj = "From: %s <%s>\n" %(settings.AccountName,settings.Sender)
    msj += "To: To Person <%s>\n" % email
    msj += "Subject: %s\n" % subject
    msj += message
    try:
       smtpObj = smtplib.SMTP(settings.SMTPServer,settings.SMTPPort)
       smtpObj.sendmail(sender, receivers, msj)
       return True
    except Exception as e:
       return Error(str(e))
