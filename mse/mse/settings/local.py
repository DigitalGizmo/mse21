"""
Local Django settings for mse project.
"""

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


SITE_ID = 1

# 3 for devel, 4 for public
STATUS_LEVEL = 3
# for devel vs. produciton diffes: google analytics in base.html
IS_PRODUCTION = False

# for managment, invoke, collect
#VIRTUALENV_PATH = BASE_DIR.ancestor(3).child('virtualenvs','mse','bin')
