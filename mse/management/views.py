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
		run('/usr/local/bin/msedev_collect.sh')
		feedback = 'Collectstatic  started for msesand '
	return render_to_response('management/collect.html', {'feedback': feedback})

@task
def collect_sand(request):
	if settings.IS_PRODUCTION:
		feedback = 'No collect possible in producion environment.'
	else:
		run('/usr/local/bin/msesand_collect.sh')
		feedback = 'Collectstatic  started for msesand '
	return render_to_response('management/collect.html', {'feedback': feedback})
