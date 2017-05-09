from main import app
from flask_mail import Mail
mail = Mail(app)
from flask_mail import Message
import getsettings
settings = getsettings.getSettings()

def sendFlaskMail(email,subject,message):
    sender = "%s <%s>" % (settings.AccountName,settings.Sender)
    receivers = [email]
    msg = Message(subject,sender=sender,recipients=receivers)
    msg.html = message
    mail.send(msg)
