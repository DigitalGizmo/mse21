# from django.shortcuts import render
from django.shortcuts import render_to_response, get_object_or_404
from django.conf import settings

from invoke import task, run
from unipath import Path

def index(request):
    return render_to_response('management/index.html')

@task
def collect(request):
	if settings.IS_PRODUCTION:
		feedback = 'No collect possible in producion environment.'
	else:
		settings.BASE_DIR.child('mse', 'manage.py collectstatic -v0 --noinput')
		feedback = 'Collectstatic has started.'
	return render_to_response('management/collect.html', {'feedback': feedback})
