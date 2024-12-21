import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import Config

class EmailSender:
    def __init__(self, smtp_server="smtp.gmail.com", port=587, username=Config.EMAIL_USERNAME, password=Config.EMAIL_PASSWORD):
        """
        Inicijalizuje EmailSender sa detaljima SMTP servera.

        :param smtp_server: Adresa SMTP servera (default: smtp.gmail.com za Gmail).
        :param port: Port za SMTP server (default: 587 za Gmail).
        :param username: Email adresa koja će se koristiti za slanje.
        :param password: Lozinka ili aplikacioni ključ za email nalog.
        """
        self.smtp_server = smtp_server
        self.port = port
        self.username = username
        self.password = password

    def send_email(self, recipient, subject, body):
        """
        Šalje email na zadatu adresu.

        :param recipient: Email primaoca.
        :param subject: Naslov emaila.
        :param body: Telo email poruke.
        :raises: Exception ako slanje emaila ne uspe.
        """
        try:
            # Priprema emaila
            msg = MIMEMultipart()
            msg["From"] = self.username
            msg["To"] = recipient
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain"))

            # Konektovanje na SMTP server i slanje emaila
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                server.starttls()  # Aktivira TLS enkripciju
                server.login(self.username, self.password)  # Prijava na email nalog
                server.sendmail(self.username, recipient, msg.as_string())  # Slanje poruke
            print(f"Email successfully sent to {recipient}")
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            raise