from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
from resources.models import Resourceset

# map_list shows in set, maps shows in sidebar

def index(request):
    resourceset_list = Resourceset.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    return render_to_response('resources/index.html', {'resourceset_list': resourceset_list})

def index_list(request):
    resource_object_list = Resourceset.objects.all().order_by('ordinal')
    return render_to_response('resources/index_list.html', {'resource_object_list': resource_object_list})

def detail(request, short_name):
    o = get_object_or_404(Resourceset, short_name=short_name)
    artifact_list = o.artifact_set.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')  
    document_list = o.document_set.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')  
    map_list = o.geomap_set.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')  
    lecture_list = o.lecture_set.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')  
    related_pdfs = o.connections.filter(link_heading='related')  
    classroom_pdfs = o.connections.filter(link_heading='classroom')  
    essays = o.essays.all()  
    audiovisuals = o.audiovisuals.all()  
    maps = o.maps.all()  
    lectures = o.lectures.all()  
    # determine whether to show further reading link
    if o.biblio.all():
        has_further = True
    else:
        has_further = False
    return render_to_response('resources/detail.html', {'resource_object': o, 'artifact_list': artifact_list, 'document_list': document_list, 'map_list': map_list, 'lecture_list': lecture_list, 'classroom_pdfs': classroom_pdfs, 'related_pdfs': related_pdfs, 'essays': essays, 'audiovisuals': audiovisuals, 'maps': maps, 'lectures': lectures, 'resource_type': 'set', 'has_further': has_further})

def ideas(request, short_name):
    o = get_object_or_404(Resourceset, short_name=short_name)
    idea_list = o.idea_set.all()
    title = o.title
    return render_to_response('connections/ideas.html', {'title': title, 'idea_list': idea_list})


def biblio(request, short_name):
    o = get_object_or_404(Resourceset, short_name=short_name)
    source_list = o.biblio.filter(biblio_type="source")
    arts_list = o.biblio.filter(biblio_type="related_arts")
    item_title = o.title
    return render_to_response('connections/biblio.html', {'source_list': source_list, 'arts_list': arts_list, 'item_title': item_title})
