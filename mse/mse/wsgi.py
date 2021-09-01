"""
WSGI config for mse project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/

Deployed instances (dev and prod on eApps) will have mod_wsgi active, as configured in 
httpd.conf, to have the appropriate process_group name.

Otherwise this will use the local settings.
Some devel envs won't need or have mod_wsgi
"""

import os

# try:
# 	import mod_wsgi
# 	try:
# 		# os.environ['DJANGO_SETTINGS_MODULE'] = 'mse.settings.%s' % mod_wsgi.process_group
# 		os.environ['DJANGO_SETTINGS_MODULE'] = 'mse.settings.%s' % mod_wsgi.process_group
# 	except AttributeError:
# 		# let the above setting stand
# 		os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mse.settings.local")
# except ImportError:
# 	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mse.settings.local")
	
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mse.settings.local')

application = get_wsgi_application()
