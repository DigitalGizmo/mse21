from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
# from artifacts.models import Artifact

def index(request):
    # handle multiple sites. Use raw ID which will work on devel as well as public
    if settings.SITE_ID == 2:
        return render_to_response('pq/index.html', {})
    else:
        return render_to_response('index.html')

