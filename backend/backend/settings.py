from pathlib import Path
from os import path, environ
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

########################### BASE CONFIGURATION ###########################

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Development mode
DEVELOPMENT_MODE = environ.get('DEVELOPMENT_MODE')

# Secret key
SECRET_KEY = environ.get('SECRET_KEY')

# Allowed hosts
ALLOWED_HOSTS = environ.get('ALLOWED_HOSTS').split(',')

# Secure proxy SSL header
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Application definition
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

################ APPLICATIONS ################

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "djoser",
    "user_visit",
    
    "users",
    "data",
    "weather",
    "timeseries",
]

########################### DATABASE CONFIGURATION ###########################

DATABASES = {
    "default": {
        "ENGINE": environ.get('DATA_DB_ENGINE'),
        "NAME": environ.get('DATA_DB_NAME'),
        "USER": environ.get('DATA_DB_USER'),
        "PASSWORD": environ.get('DATA_DB_PASSWORD'),
        "HOST": environ.get('DATA_DB_HOST'),
        "PORT": environ.get('DATA_DB_PORT'),
    },
    "test": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": "test_database",
    },
}

########################### AUTHENTICATION AND USER MODEL ###########################

AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

########################### CORS CONFIGURATION ###########################

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

########################### MIDDLEWARE ###########################

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",  # Security features such as XSS protection, HSTS, etc.
    "django.contrib.sessions.middleware.SessionMiddleware",  # Manages session data for each user.
    "corsheaders.middleware.CorsMiddleware",  # Handles Cross-Origin Resource Sharing (CORS) for allowing cross-origin requests.
    "django.middleware.common.CommonMiddleware",  # Common utilities like URL slashes, redirects, etc.
    "django.middleware.csrf.CsrfViewMiddleware",  # Protects against Cross-Site Request Forgery (CSRF).
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # Associates users with requests based on session data.
    "django.contrib.messages.middleware.MessageMiddleware",  # Temporary message storage between requests.
    "django.middleware.clickjacking.XFrameOptionsMiddleware",  # Protects against clickjacking by setting X-Frame-Options headers.
    "user_visit.middleware.UserVisitMiddleware",  # Custom middleware to log user visits (tracks user interactions with the site).
]

########################### TEMPLATES ###########################

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

########################### REST FRAMEWORK ###########################

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'users.authentication.CustomJWTAuthentication'
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

########################### DJOSER CONFIGURATION ###########################

DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': 'reset/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,
    'ACTIVATION_URL': 'activation/{uid}/{token}',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'TOKEN_MODEL': None,
}

########################### AUTH COOKIE SETTINGS ###########################

AUTH_COOKIE = "access"
AUTH_COOKIE_MAX_AGE = 60 * 60 * 24
AUTH_COOKIE_ACCES_MAX_AGE = 60 * 60 * 24
AUTH_COOKIE_REFRESH_MAX_AGE = 60 * 60 * 24
AUTH_COOKIE_SECURE = True
AUTH_COOKIE_HTTP_ONLY = True
AUTH_COOKIE_PATH = '/'
AUTH_COOKIE_SAMESITE = 'None'

########################### CACHE CONFIGURATION ###########################

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',  # Unique identifier for the cache instance
        'TIMEOUT': 3600,  # Cache timeout in seconds (3600 seconds = 1 hour)
        'OPTIONS': {
            'MAX_ENTRIES': 100,  # Max number of cache entries
            'CULL_FREQUENCY': 15,  # Fraction of entries to remove when max is reached
        }
    }
}

########################### CHANNELS ###########################

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

########################### STATIC FILES ###########################

STATIC_URL = '/static/'
STATIC_ROOT = path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [
    path.join(STATIC_ROOT, 'rest_framework'),
    path.join(STATIC_ROOT, 'admin'),
]

########################### INTERNATIONALIZATION ###########################

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

########################### WEATHER API KEY ###########################

OPENWEATHERMAP_API_KEY = environ.get('OPENWEATHERMAP_API_KEY')

########################### TESTING CONFIGURATION ###########################

TEST_RUNNER = "redgreenunittest.django.runner.RedGreenDiscoverRunner"