"""
Local Django settings for mse project.
"""

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Application definition
# only adds mod_wsgi.server
# may not use wsgi express -- don't know how to use it with multiple settings files
#INSTALLED_APPS += ('mod_wsgi.server', )

DATABASES = {
    'default': {
        #'ENGINE': 'django.db.backends.sqlite3',
        #'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'msedb',
        'USER': 'don',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

SITE_ID = 1

# 3 for devel, 4 for public
STATUS_LEVEL = 3
# for devel vs. produciton diffes: google analytics in base.html
IS_PRODUCTION = False
