from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
from artifacts.models import Artifact

def index(request):
    resource_object_list = Artifact.objects.filter(augmented=True, 
        status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    return render_to_response('artifacts/index.html', {'resource_object_list': resource_object_list, 
        'resource_type': 'artifact'})

def index_raw(request):
    resource_object_list = Artifact.objects.filter(augmented=False, 
        status_num__gte=settings.STATUS_LEVEL).order_by('title')
    return render_to_response('artifacts/index_raw.html', {'resource_object_list': resource_object_list, 
        'resource_type': 'artifact'})

def index_list(request):
    resource_object_list = Artifact.objects.all().order_by('id_number')
    return render_to_response('artifacts/index_list.html', {'resource_object_list': resource_object_list})

def detail(request, short_name):
    o = get_object_or_404(Artifact, short_name=short_name)
    # determine whether to show further reading link
    if o.biblio.all():
        has_further = True
    else:
        has_further = False
    # both aug and raw
    related_artifacts = o.artifacts.filter(status_num__gte=settings.STATUS_LEVEL) 
    related_docs = o.documents.filter(status_num__gte=settings.STATUS_LEVEL) 
    # augmented or raw
    if o.augmented == True:       
        has_items = True # will be false in raw if raw has no related artifacts, docs
        related_pdfs = o.connections.filter(link_heading='related')  
        classroom_pdfs = o.connections.filter(link_heading='classroom')  
        essays = o.essays.all()  
        audiovisuals = o.audiovisuals.all()  
        maps = o.maps.all()  
        lectures = o.lectures.all()  
        if o.is_vertical == True:       
            template_name = "detail_vertical"
        else:
            template_name = "detail"
        return render_to_response('artifacts/' + template_name + '.html', {'resource_object': o, 
            'related_artifacts': related_artifacts, 'related_docs': related_docs, 
            'classroom_pdfs': classroom_pdfs, 'related_pdfs': related_pdfs, 'essays': essays, 
            'audiovisuals': audiovisuals, 'maps': maps, 'lectures': lectures, 
            'resource_type': 'artifact', 'has_further': has_further, 'page_suffix': 'A', 
            'has_items': has_items})
    else:
        # raw: vertical or horizontal
        if o.is_vertical == True:       
            template_name = "detail_raw_vertical"
        else:
            template_name = "detail_raw"
        # raw: show Items from the Collection header or not
        if related_artifacts or related_docs:
            has_items = True
        else:
            has_items = False
        return render_to_response('artifacts/' + template_name + '.html', {'resource_object': o, 
            'page_suffix': 'A', 'related_artifacts': related_artifacts, 'related_docs': related_docs, 
            'has_items': has_items})

""" raw view is determined by data field (not separte view) """

def slim(request, short_name):
    o = get_object_or_404(Artifact, short_name=short_name)
    # a condition in slim.html checks for o.is_vertical
    # Pequot version needs siteID in order to supress "go to full page"
    return render_to_response('artifacts/slim.html', {'resource_object': o, 
        'resource_type': 'artifact', 'siteid': settings.SITE_ID})

def artifact_view(request, short_name, page_suffix):
    """
	Supports Ajax call to replace current view
	"""
    o = get_object_or_404(Artifact, short_name=short_name)
    #filename = d.bibid + "_" + page_suffix
    return render_to_response('artifacts/artifact_view.html', {'resource_object': o, 
        'page_suffix': page_suffix})

def zoom(request, short_name, page_suffix):
    """
	Supports js call to create new zoom window
	"""
    o = get_object_or_404(Artifact, short_name=short_name)
    return render_to_response('artifacts/zoom.html', {'resource_object': o, 'page_suffix': page_suffix})

def ideas(request, short_name):
    #print "short name: " + short_name
    o = get_object_or_404(Artifact, short_name=short_name)
    idea_list = o.idea_set.all()
    title = o.title
    return render_to_response('connections/ideas.html', {'title': title,'idea_list': idea_list})

def biblio(request, short_name):
    a = get_object_or_404(Artifact, short_name=short_name)
    source_list = a.biblio.filter(biblio_type="source")
    arts_list = a.biblio.filter(biblio_type="related_arts")
    item_title = a.title
    return render_to_response('connections/biblio.html', {'source_list': source_list, 
        'arts_list': arts_list, 'item_title': item_title})

