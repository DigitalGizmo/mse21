"""
Local Django settings for mse project.
"""

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Static files (CSS, JavaScript, Images)
STATIC_ROOT = BASE_DIR.ancestor(2).child("mse2_static")

SITE_ID = 1

# 3 for devel, 4 for public
STATUS_LEVEL = 2
# for devel vs. produciton diffes: google analytics in base.html
IS_PRODUCTION = False
