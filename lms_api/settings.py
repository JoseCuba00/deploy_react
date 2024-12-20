"""
Django settings for lms_api project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from dotenv import load_dotenv
import dj_database_url # Modulo para invocar la base de datos con mas facilidad
import os 
load_dotenv()

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")
YANDEX_TRANSLATE_KEY = os.getenv("YANDEX_TRANSLATE_KEY")
ELEVEN_LABS_KEY= os.getenv("ELEVEN_LABS_KEY")
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False


import cloudinary_storage


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "whitenoise.runserver_nostatic", # permite usar los archivos estaticos en produccion
    "main",
    "rest_framework", # Para poder usar el rest API de Django
    "rest_framework.authtoken", # Para poder enviar el token al usuario 
    "corsheaders", # Para que no funcione la defensa cors y poder hacer llamados de test
    'rest_framework_simplejwt.token_blacklist', # Para poder usar la blacklist
    "django_extensions",# Para poder usar HTTPS
    "django_ckeditor_5", # Para crear contenido HTML mas facil 
    'cloudinary',
    'cloudinary_storage', # Para poder user cloudinary
    "storages",# Para guardar los archivos en Yandex S3
    

]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "corsheaders.middleware.CorsMiddleware", # Permitir llamados sin cors
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    
]

ROOT_URLCONF = "lms_api.urls"

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

WSGI_APPLICATION = "lms_api.wsgi.app"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

REST_FRAMEWORK = { # Para indicar que la autentificacion va a ser por token  

    'DEFAULT_AUTHENTICATION_CLASSES':[
        #'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

DATABASES = {
    "default": dj_database_url.config(default=os.getenv('DATABASE_URL'))
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Europe/Moscow"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


ALLOWED_HOSTS = ['*']

# api/settings.py


CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_WHITELIST = [
    'http://127.0.0.1',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://localhost:3000',
    'https://deploy-react-mocha.vercel.app'
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    'https://deploy-react-mocha.vercel.app'
]

CSRF_TRUSTED_ORIGINS = [
    "http://*",
    'https://deploy-react-mocha.vercel.app',
    'https://web-production-0a07.up.railway.app',

]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}

STATICFILES_STORAGE =  "whitenoise.storage.CompressedManifestStaticFilesStorage",



###########################################################

from datetime import timedelta
...

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=3),
    'ROTATE_REFRESH_TOKENS': True, # Si se envia un refresh token a TokenRefreshView se devuelve otro refresh token 
    'BLACKLIST_AFTER_ROTATION': True, # no permite que se puedan usar tokens que ya han sido usados 
    'UPDATE_LAST_LOGIN': True, #Para que se actualice el campo de last_login en la tabla auth_user

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0, # Le da un poco de margen al tiempo de expiracion

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION', # indica que Authorization es el nombre del authorization header name
    'USER_ID_FIELD': 'id', # El campo de la base de datos que se incluira en los token para identificar al usuario 
    'USER_ID_CLAIM': 'id', # Para que en el token se incluya el user_id
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',# Lo que verifica si a un usuario todavia se le permite autenticarse 

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=3),
}
import os



#Permitir heredar la clase Users
AUTH_USER_MODEL = "main.Students"

STATIC_ROOT = os.path.join(BASE_DIR,'staticfiles')




customColorPalette = [
        {
            'color': 'hsl(4, 90%, 58%)',
            'label': 'Red'
        },
        {
            'color': 'hsl(340, 82%, 52%)',
            'label': 'Pink'
        },
        {
            'color': 'hsl(291, 64%, 42%)',
            'label': 'Purple'
        },
        {
            'color': 'hsl(262, 52%, 47%)',
            'label': 'Deep Purple'
        },
        {
            'color': 'hsl(231, 48%, 48%)',
            'label': 'Indigo'
        },
        {
            'color': 'hsl(207, 90%, 54%)',
            'label': 'Blue'
        },
    ]

CKEDITOR_5_CONFIGS = {
    'default': {
         
        'toolbar': ['heading', '|', 'bold', 'italic', 'link',
                    'bulletedList', 'numberedList', 'blockQuote', 'imageUpload', ],
 

    },
    'extends': {
        'blockToolbar': [
            'paragraph', 'heading1', 'heading2', 'heading3',
            '|',
            'bulletedList', 'numberedList',
            '|',
            'blockQuote',
        ],

        'toolbar': ['heading', '|', 'outdent', 'indent', '|', 'bold', 'italic', 'link', 'underline', 'strikethrough',
        'code','subscript', 'superscript', 'highlight', '|', 'codeBlock', 'sourceEditing', 'insertImage',
                    'bulletedList', 'numberedList', 'todoList', '|',  'blockQuote', 'imageUpload', '|',
                    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'mediaEmbed', 'removeFormat',
                    'insertTable','fileUpload'],
        'image': {
            'toolbar': ['imageTextAlternative', '|', 'imageStyle:alignLeft',
                        'imageStyle:alignRight', 'imageStyle:alignCenter', 'imageStyle:side',  '|'],
            'styles': [
                'full',
                'side',
                'alignLeft',
                'alignRight',
                'alignCenter',
            ]

        },
        'table': {
            'contentToolbar': [ 'tableColumn', 'tableRow', 'mergeTableCells',
            'tableProperties', 'tableCellProperties','tableColumnResize' ],
            'tableProperties': {
                'borderColors': customColorPalette,
                'backgroundColors': customColorPalette
            },
            'tableCellProperties': {
                'borderColors': customColorPalette,
                'backgroundColors': customColorPalette
            }
        },
        'heading' : {
            'options': [
                { 'model': 'paragraph', 'title': 'Paragraph', 'class': 'ck-heading_paragraph' },
                { 'model': 'heading1', 'view': 'h1', 'title': 'Heading 1', 'class': 'ck-heading_heading1' },
                { 'model': 'heading2', 'view': 'h2', 'title': 'Heading 2', 'class': 'ck-heading_heading2' },
                { 'model': 'heading3', 'view': 'h3', 'title': 'Heading 3', 'class': 'ck-heading_heading3' }
            ]
        }
    },
    'list': {
        'properties': {
            'styles': 'true',
            'startIndex': 'true',
            'reversed': 'true',
        }
    }
}


CK_EDITOR_5_UPLOAD_FILE_VIEW_NAME = "custom_upload_file" # La URL que buscara para activar la funcion de guardado de los files
CKEDITOR_5_ALLOW_ALL_FILE_TYPES = True
CKEDITOR_5_UPLOAD_FILE_TYPES = ['jpeg', 'pdf', 'png'] # optional

# Crear un archivo json para las credenciales de google 
import json
import tempfile

# Crear un archivo temporal
temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.json')

# Escribir el contenido de las credenciales en el archivo temporal
temp_file.write(os.getenv("GOOGLE_KEY").encode())
temp_file.close()

# Establecer la variable de entorno GOOGLE_APPLICATION_CREDENTIALS a la ruta del archivo temporal
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = temp_file.name

	

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage' # Para guardar las cosas en Yandex s3

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_S3_ENDPOINT_URL = os.getenv("AWS_S3_ENDPOINT_URL")
AWS_S3_REGION_NAME = 'ru-central1'  # Ajusta esto si estás utilizando una región diferente
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.storage.yandexcloud.net'

# Configuración adicional opcional
AWS_QUERYSTRING_AUTH = False  # Para evitar que los enlaces de S3 expiren


