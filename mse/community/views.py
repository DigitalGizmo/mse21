from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
from community.models import Profile, Project
from artifacts.models import Artifact
from documents.models import Document
from maps.models import Geomap

def index(request):
    item_list = Profile.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    project_list = Project.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    artifact_list = Artifact.objects.all().filter(augmented=True, status_num__gte=settings.STATUS_LEVEL)
    document_list = Document.objects.all().filter(augmented=True, status_num__gte=settings.STATUS_LEVEL)
    map_list = Geomap.objects.all().filter(augmented=True, status_num__gte=settings.STATUS_LEVEL)
    return render_to_response('community/index.html', {'item_list': item_list, 'project_list': project_list, 'artifact_list': artifact_list, 'document_list': document_list, 'map_list': map_list})

def profile(request, short_name):
    o = get_object_or_404(Profile, short_name=short_name)
    # did have for artifact in resource_object.artifact_set.all in template
    # but now retrieved here in order to filter for status
    project_list = o.project_set.filter(status_num__gte=settings.STATUS_LEVEL)
    artifact_list = o.artifact_set.filter(status_num__gte=settings.STATUS_LEVEL)
    document_list = o.document_set.filter(status_num__gte=settings.STATUS_LEVEL)
    geomap_list = o.geomap_set.filter(status_num__gte=settings.STATUS_LEVEL)
    interview_list = o.interview_set.filter(status_num__gte=settings.STATUS_LEVEL)
    return render_to_response('community/profile.html', {'resource_object': o, 'project_list': project_list, 'artifact_list': artifact_list, 'document_list': document_list, 'geomap_list': geomap_list, 'interview_list': interview_list})
# 'classroom_pdfs': classroom_pdfs

def project(request, short_name):
    o = get_object_or_404(Project, short_name=short_name)
    # to show Related Items from the Collection
    related_artifacts = o.artifacts.filter(status_num__gte=settings.STATUS_LEVEL) 
    related_docs = o.documents.filter(status_num__gte=settings.STATUS_LEVEL)
    # to show Related Resources
    related_pdfs = o.connections.filter(link_heading='related')  
    essays = o.essays.all()  
    audiovisuals = o.audiovisuals.all()  
    maps = o.maps.all()  
    lectures = o.lectures.all()
    # to show In the Classroom
    classroom_pdfs = o.connections.filter(link_heading='classroom')  
    return render_to_response('community/project.html', {'resource_object': o, 'related_artifacts': related_artifacts, 'related_docs': related_docs, 'classroom_pdfs': classroom_pdfs, 'related_pdfs': related_pdfs, 'essays': essays, 'audiovisuals': audiovisuals, 'maps': maps, 'lectures': lectures, 'resource_type': 'map', 'has_items': True})

