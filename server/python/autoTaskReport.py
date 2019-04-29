"""
autoTaskReport

This class uses the email address
    autotaskreport@gmail.com
to send email notifications to a specified recipient over a HTTP proxy.
The sending email-address can be changed by spcifying sender, password,
smtp_host and smtp_port arguments when instantiating the autoTaskReport object.

By default, autoTaskReport() objects uses the following proxy configuration:
    host: proxy.emea.etn.com
    port: 8080
These defaults can be changed by specifying proxy_host and proxy_port arguments
when instantiating the autoTaskReport object.

"""
from smtplib import SMTP

default_sender = 'autotaskreport@gmail.com'
default_user = 'autotaskreport@gmail.com'
default_password = 'taskreportpw'
default_smtp_host = 'smtp.gmail.com'
default_smtp_port = 587

class autoTaskReport(object):
    def __init__(self,
                 recipient,
                 sender=default_sender,
                 user=default_user,
                 password=default_password,
                 smtp_host=default_smtp_host,
                 smtp_port=default_smtp_port,
                 mimetype='html'):

        self.recipient = recipient
        self.sender = sender
        self.user = user
        self.password = password
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.log = ''
        self.mimetype = mimetype

        if not isinstance(self.recipient, (list, tuple)):
            self.recipient = [self.recipient]

    def send(self, body, subject=None):
        """
        Sends an email to the recipient with the specified body text.
        Optionally, the subject can be specified.

        :param body:        Body text of the message
        :param subject:     Subject line text
        :return:            Login reply of the smtp server (235 if accepted)
        """

        # Creates a proxySMTP object to connect to the SMTP server
        conn = SMTP(host=self.smtp_host,
                    port=self.smtp_port)

        conn.ehlo()
        conn.starttls()
        conn.ehlo()

        # Logs in to the mail account
        r, d = conn.login(self.user, self.password)
        self.log += 'Login reply: {:d}\n'.format(r)

        recipientString = ', '.join(self.recipient)
        if subject is None:
            subjectString = '(no subject)'
        else:
            subjectString = subject

        if self.mimetype == 'html':
            message = 'Content-Type: text/html; charset=utf-8\n'
        else:
            message = 'Content-Type: text/plain; charset=utf-8\n'

        message += """From: AutoTaskReport <autotaskreport@badel.org>
To: {:s}
Subject: {:s}

{:s}""".format(recipientString, subjectString, body)

        # Sends the email
        r = conn.sendmail(self.sender, self.recipient, message)
        if len(r) > 0:
            self.log += 'Errors sending email:\n{:s}\n'.format(str(r))
        else:
            self.log += 'Email sent successfully.\n'

        # Closes the connection
        conn.close()
