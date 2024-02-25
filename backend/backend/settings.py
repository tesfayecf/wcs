from pathlib import Path
from os import path, environ
from dotenv import load_dotenv
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Development mode
DEVELOPMENT_MODE = environ.get('DEVELOPMENT_MODE')

# Secret key
SECRET_KEY = environ.get('SECRET_KEY')

# Debug mode
DEBUG = environ.get('DEBUG')

# Allowed hosts
ALLOWED_HOSTS = environ.get('ALLOWED_HOSTS').split(',')

# Secure proxy SSL header
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


################ APPLICATIONS ################
# Application definition
INSTALLED_APPS = [
    "channels",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "user_visit",
    "data",
    "users",
    "sensors"
]

# Channels definition
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

# Middleware definition
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "user_visit.middleware.UserVisitMiddleware", # user log 
]
################################################


################ URLS AND TEMPLATES ################
# Root URLconf
ROOT_URLCONF = "backend.urls"

# Templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ASGI application
ASGI_APPLICATION = "backend.routing.application"
################################################


################ DATABASE ################
DATABASE_ROUTERS = ['backend.routers.TimeSeriesRouter']

DATABASES = {
    "default": {
        "ENGINE": environ.get('DEFAULT_DB_ENGINE'),
        "NAME": environ.get('DEFAULT_DB_NAME'),
        "USER": environ.get('DEFAULT_DB_USER'),
        "PASSWORD": environ.get('DEFAULT_DB_PASSWORD'),
        "HOST": environ.get('DEFAULT_DB_HOST'),
        "PORT": environ.get('DEFAULT_DB_PORT'),
    },
    "timeseries": {
        "ENGINE": environ.get('TIMESERIES_DB_ENGINE'),
        "NAME": environ.get('TIMESERIES_DB_NAME'),
        "USER": environ.get('TIMESERIES_DB_USER'),
        "PASSWORD": environ.get('TIMESERIES_DB_PASSWORD'),
        "HOST": environ.get('TIMESERIES_DB_HOST'),
        "PORT": environ.get('TIMESERIES_DB_PORT'),
    }
}
################################################


################ PASSWORD VALIDATION ################
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]
################################################


################ INTERNATIONALIZATION ################
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
################################################


################ STATIC FILES ################
STATIC_URL = '/static/'
STATIC_ROOT = path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [
    path.join(STATIC_ROOT, 'rest_framework'),
    path.join(STATIC_ROOT, 'admin'),
]
################################################


################ REST FRAMEWORK ################
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'users.authentication.CustomJWTAuthentication'
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}
################################################


################ DJOSER ################
DJOSER ={
    'PASSWORD_RESET_CONFIRM_URL': 'password-reset/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,
    'ACTIVATION_URL': 'activation/{uid}/{token}',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'TOKEN_MODEL': None,
}

# Name access token
AUTH_COOKIE = 'access'
################################################


################ AUTHENTICATION COOKIE ################
AUTH_COOKIE = "acces"
AUTH_COOKIE_MAX_AGE = 60*60*24
AUTH_COOKIE_ACCES_MAX_AGE = 60*5 
AUTH_COOKIE_REFRESH_MAX_AGE = 60*60*24
AUTH_COOKIE_SECURE = 'True'
AUTH_COOKIE_HTTP_ONLY = True
AUTH_COOKIE_PATH = '/'
AUTH_COOKIE_SAMESITE = 'None'
################################################


################ CORS ################
CORS_ALLOWED_ORIGINS = environ.get(
    "CORS_ALLOWED_ORIGINS", 
    "http://localhost:3000,http://192.168.0.1:3000,http://127.0.0.1:3000",
).split(",")
CORS_ALLOW_CREDENTIALS = True
################################################


################ DEFAULT PRIMARY KEY FIELD TYPE ################
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
################################################


################ CUSTOM USER MODEL ################
AUTH_USER_MODEL = 'users.UserAccount'
################################################