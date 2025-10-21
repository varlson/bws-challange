# utils/email_utils.py
from django.core.mail import send_mail
from django.conf import settings

def send_two_factor_code(user):
    subject = "Seu código de verificação"
    message = f"Olá {user.username},\n\nSeu código de verificação é: {user.two_factor_code}\n\nEle expira em 5 minutos."
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
