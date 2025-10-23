from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid
import random

from django.core.mail import send_mail
from django.conf import settings



class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    cnpj = models.CharField(max_length=18, unique=True)
    domain = models.CharField(max_length=100, help_text="e.g. authenix.com")
    corporate_email = models.EmailField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class AccessLevel(models.TextChoices):
        SUPER_ADMIN = "SUPER_ADMIN", "Super Administrator"
        ADMIN = "ADMIN", "Administrator"
        MANAGER = "MANAGER", "Manager"
        USER = "USER", "User"

    access_level = models.CharField(
        max_length=20,
        choices=AccessLevel.choices,
        default=AccessLevel.USER
    )

    def __str__(self):
        return self.name


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    phone = models.CharField(max_length=15, blank=True)
    profile_picture = models.ImageField(upload_to="profiles/", blank=True)
    is_email_verified = models.BooleanField(default=False)
    
    email_verification_token = models.UUIDField(blank=True, null=True)
    email_verification_expires_at = models.DateTimeField(blank=True, null=True)

    
    
    two_factor_code = models.CharField(max_length=6, blank=True, null=True)
    two_factor_expires_at = models.DateTimeField(blank=True, null=True)
    is_two_factor_verified = models.BooleanField(default=False)
    
    reg_confirmation_code = models.CharField(max_length=6, blank=True, null=True)
    reg_confirmation_expires_at = models.DateTimeField(blank=True, null=True)
    locked_until = models.DateTimeField(blank=True, null=True)    
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def is_locked(self):
        return self.locked_until and self.locked_until > timezone.now()

    def generate_email_verification_token(self):
        """Gera token único e define expiração (1 hora)."""
        self.email_verification_token = uuid.uuid4()
        self.email_verification_expires_at = timezone.now() + timezone.timedelta(hours=1)
        self.save(update_fields=["email_verification_token", "email_verification_expires_at"])
        return self.email_verification_token
    
    def generate_code(self, isTwoFactor: bool = True):
        """Generate a 6-digit numeric code and expiration time (e.g., 5 minutes)."""
        
        randParams = (100000, 999999) if isTwoFactor else (1000, 9999)
        

        if isTwoFactor:
            self.two_factor_code = str(random.randint(randParams[0], randParams[1]))
            self.two_factor_expires_at = timezone.now() + timezone.timedelta(minutes=5)
            self.is_two_factor_verified = False
            self.save(update_fields=["two_factor_code", "two_factor_expires_at", "is_two_factor_verified"])
            return self.two_factor_code
        else:
            self.reg_confirmation_code = str(random.randint(randParams[0], randParams[1]))
            self.reg_confirmation_expires_at = timezone.now() + timezone.timedelta(minutes=10)
            self.save(update_fields=["reg_confirmation_code", "reg_confirmation_expires_at"])
            return self.reg_confirmation_code
    
    def send_code(user):
        subject = "Seu código de verificação"
        message = f"Olá {user.username},\n\nSeu código de verificação é: {user.two_factor_code}\n\nEle expira em 5 minutos."
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
    )

      

    def verify_code(self, code: str, isTwoFactor: bool = True) -> bool:
        """Validate the received code and expiration."""
        
        if isTwoFactor:
            if (
                self.two_factor_code
                and self.two_factor_expires_at
                and timezone.now() <= self.two_factor_expires_at
                and code == self.two_factor_code
            ):
                self.is_two_factor_verified = True
                self.two_factor_code = None
                self.save(update_fields=["is_two_factor_verified", "two_factor_code"])
                return True
        else:
            if (
                self.reg_confirmation_code
                and self.reg_confirmation_expires_at
                and timezone.now() <= self.reg_confirmation_expires_at
                and code == self.reg_confirmation_code
            ):
                self.is_email_verified = True
                self.reg_confirmation_code = None
                self.save(update_fields=["is_email_verified", "reg_confirmation_code"])
                return True
        return False

    def __str__(self):
        return f"({self.email})"

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
