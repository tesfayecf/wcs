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

# Root URL configuration
ROOT_URLCONF = "backend.urls"

################ APPLICATIONS ################

INSTALLED_APPS = [
    "django.contrib.admin", # Admin dashboard
    "django.contrib.auth", # Authentication
    "django.contrib.contenttypes", # Content types
    "django.contrib.sessions", # Sessions
    "django.contrib.messages", # Messages
    "django.contrib.staticfiles", # Static files

    # Third-party apps
    "corsheaders", # Allows cross-origin requests
    "rest_framework", # Django REST framework
    "rest_framework.authtoken", # Token authentication (TODO: Check if remove, now using sessions)
    "user_visit", # User visit tracking
    "django_typomatic", # Django Typomatic

    # Local apps
    "users", # Users management
    "data", # Groups, tanks, sensors managment
    "weather", # Weather data management
    "timeseries", # Timeseries data management
]

########################### MIDDLEWARE ###########################

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",  # Security features such as XSS protection, HSTS, etc.
    "django.contrib.sessions.middleware.SessionMiddleware",  # Manages session data for each user.
    "corsheaders.middleware.CorsMiddleware",  # Handles Cross-Origin Resource Sharing (CORS) for allowing cross-origin requests.
    "django.middleware.common.CommonMiddleware",  # Common utilities like URL slashes, redirects, etc.
    "django.middleware.csrf.CsrfViewMiddleware",  # Protects against Cross-Site Request Forgery (CSRF).
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # Associates users with requests based on session data.
    "django.middleware.clickjacking.XFrameOptionsMiddleware",  # Protects against clickjacking by setting X-Frame-Options headers.
    "django.contrib.messages.middleware.MessageMiddleware",  # Manages messages for users.
    "user_visit.middleware.UserVisitMiddleware",  # Custom middleware to log user visits (tracks user interactions with the site).
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
        "TEST": {
            "NAME": "test_database",  # Specify a custom test database name
        },
    },
}

########################### AUTH (middleware) AND USER MODEL CONFIGURATION ###########################

AUTH_USER_MODEL = 'users.User'
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
SESSION_COOKIE_AGE = 604800  # 1 weeks, in seconds
SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # Optional: expire session when browser closes
SESSION_COOKIE_SECURE = False  # Optional: set to true if using HTTPS
CSRF_COOKIE_SECURE = False  # Optional: set to true if using HTTPS
SESSION_COOKIE_SAMESITE = 'Lax'  # or 'Strict'
CSRF_COOKIE_SAMESITE = 'Lax'  # or 'Strict'

########################### CORS (middleware) CONFIGURATION ###########################

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", # Allow request from NextJS Server
    "http://127.0.0.1:3000", # Allow request from NextJS Server
]

########################### REST FRAMEWORK ###########################

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication', # Base authentication class
        'backend.csrf.CsrfExemptSessionAuthentication', # Custom session authentication (don't check csrf token)
    ]
}

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

OPENWEATHERMAP_API_KEY = environ.get('OPENWEATHERMAP_API_KEY') # OpenWeatherMap API key

########################### PYTEST CONFIGURATION ###########################

TEST_RUNNER = "redgreenunittest.django.runner.RedGreenDiscoverRunner" # PyTest configuration