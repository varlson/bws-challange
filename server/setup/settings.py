from pathlib import Path
import os
BASE_DIR = Path(__file__).resolve().parent.parent


ENV = os.getenv("DJANGO_ENV", "dev") 
PROD_FRONT_DOMAIN = "https://authenix.com"
DEV_FRONT_DOMAIN = "http://localhost:5173"
FRONTEND_DOMAIN = DEV_FRONT_DOMAIN if ENV == "dev" else PROD_FRONT_DOMAIN

print(f'Rodando em {ENV}')


SECRET_KEY = 'django-insecure-g5jdybj#$(!182nh_c0laayl9dtuq-ph&ohku()ft&hii!l01#'
DEBUG = True
ALLOWED_HOSTS = []

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # seu frontend React
    "https://authenix.com",    # produção
    "http://192.168.1.7:5173"
]
CORS_ALLOW_CREDENTIALS = True  # 🔑 permite envio de cookies
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_EXPOSE_HEADERS = ["Content-Type", "X-CSRFToken"]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "authenixApp",
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt.token_blacklist"
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'setup.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'setup.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'authenixApp.User'

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "email_aqui"
EMAIL_HOST_PASSWORD = "senha_aqui"
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "https://seusite.com",  # produção
    "http://192.168.1.7:5173/"
]

CSRF_COOKIE_NAME = "csrftoken"
CSRF_COOKIE_HTTPONLY = False  # precisa ser acessível no frontend para envio via header
CSRF_COOKIE_SAMESITE = "Strict"  # ou 'Lax' se quiser permitir refresh vindo de subdomínio
CSRF_COOKIE_SECURE = False  # coloque True em produção (HTTPS)