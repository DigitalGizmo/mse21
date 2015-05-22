from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
from community.models import Profile, Project
from artifacts.models import Artifact
from documents.models import Document
from maps.models import Geomap

def index(request):
    # handle multiple sites. Use raw ID which will work on devel as well as public
    if settings.SITE_ID == 2:
        return render_to_response('pq/index.html', {})
    else:
        item_list = Profile.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('short_name')
        project_list = Project.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('title')
        artifact_list = Artifact.objects.filter(augmented=True, status_num__gte=settings.STATUS_LEVEL)
        document_list = Document.objects.filter(augmented=True, status_num__gte=settings.STATUS_LEVEL)
        map_list = Geomap.objects.all().filter(augmented=True, status_num__gte=settings.STATUS_LEVEL)
        return render_to_response('index.html', {'item_list': item_list, 'project_list': project_list, 'artifact_list': artifact_list, 'document_list': document_list, 'map_list': map_list})

# temp dupliate for the coming soon page
def index_coming(request):
    return render_to_response('index_coming.html')
