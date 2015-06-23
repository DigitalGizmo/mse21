"""
Staging Django settings for Indian Mariners project.
"""

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


SITE_ID = 2

# 3 for devel, 4 for public
STATUS_LEVEL = 3
# for devel vs. produciton diffes: google analytics in base.html
IS_PRODUCTION = False
