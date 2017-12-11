"""
Staging Django settings for mse project.
"""

from .base import *

ALLOWED_HOSTS = ['msedev.mysticseaport.org']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


SITE_ID = 1

# 2 & 3 for devel, 4 for public
STATUS_LEVEL = 2
# for devel vs. produciton diffes: google analytics in base.html
IS_PRODUCTION = False
