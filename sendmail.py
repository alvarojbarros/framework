import smtplib
from email.mime.text import MIMEText
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage


sender = 'soporte@dondefluir.com'
email = 'alvarojbarros@gmail.com'
receivers = [email]
msg = MIMEMultipart()
msg.set_charset("utf-8")
msg['FROM'] = "%s <%s>\n" %('Donde Fluir',sender)
msg['To'] = email
msg['Subject'] = "subject"
message = "<b>peuba</b>"
body = MIMEText(message.encode('utf-8'), 'html', 'utf-8')
msg.attach(body)

attachments = ['/var/www/html/flaskapp/dondefluir/templates/DondeFluirLogo.png']

for attachment in attachments:
    fp = open(attachment, 'rb')
    img = MIMEImage(fp.read())
    fp.close()
    attachname = attachment.split('/')[len(attachment.split('/'))-1]
    img.add_header('Content-ID', '<%s>' % attachname)
    msg.attach(img)

smtpObj = smtplib.SMTP('smtp-relay.gmail.com',25)
smtpObj.sendmail(sender, receivers, msg.as_string())
