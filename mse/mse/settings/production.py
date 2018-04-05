"""
Production Django settings for mse project.
"""

from .base import *

ALLOWED_HOSTS = ['educators.mysticseaport.org']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'msedb_ed',
        'USER': 'msedb_user',
        'PASSWORD': 'cwmorgan$1814',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
    'msemap_db': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'msemap_db',
        'USER': 'msemap_user',
        'PASSWORD': 'FranAllen$1891',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

SITE_ID = 1

ADMIN_ENABLED = False

# 3 for devel, 4 for public
STATUS_LEVEL = 4
# for devel vs. produciton diffes: google analytics in base.html
IS_PRODUCTION = True
