from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
from documents.models import Document

def index(request):
    resource_object_list = Document.objects.filter(augmented=True, 
        status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    return render_to_response('documents/index.html', {'resource_object_list': resource_object_list})
 
def index_raw(request):
    resource_object_list = Document.objects.filter(augmented=False, 
        status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    return render_to_response('documents/index_raw.html', {'resource_object_list': resource_object_list})

def index_list(request):
    resource_object_list = Document.objects.all().order_by('identifier')
    return render_to_response('documents/index_list.html', {'resource_object_list': resource_object_list})

def detail(request, doc_short_name):
    o = get_object_or_404(Document, short_name=doc_short_name)
    # get first page suffix 
    # call property in model (later -- put move much more to model)
    page_suffix = o.first_page_suffix
    # both aug and raw
    related_artifacts = o.artifacts.filter(status_num__gte=settings.STATUS_LEVEL) 
    related_docs = o.documents.filter(status_num__gte=settings.STATUS_LEVEL) 
    # augmented vs. raw
    if o.augmented == True:       
        has_items = True # will be false in raw if raw has no related artifacts, docs
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
        return render_to_response('documents/detail.html', {'resource_object': o, 
            'page_suffix': page_suffix, 'doc_mode': 'img', 
            'related_artifacts': related_artifacts, 
            'related_docs': related_docs, 'classroom_pdfs': classroom_pdfs, 
            'related_pdfs': related_pdfs, 'essays': essays, 'audiovisuals': audiovisuals, 
            'maps': maps, 'lectures': lectures, 'resource_type': 'document', 
            'has_further': has_further, 'has_items': has_items})
    else:
        if related_artifacts or related_docs:
            has_items = True
        else:
            has_items = False
        return render_to_response('documents/detail_raw.html', {'resource_object': o, 
            'page_suffix': page_suffix, 'doc_mode': 'img', 'related_artifacts': related_artifacts, 
            'related_docs': related_docs, 'has_items': has_items})

""" raw view is determined by data field (not separte view) """

def slim(request, short_name):
    o = get_object_or_404(Document, short_name=short_name)
    # first page may not be "01", depends on first page entry in admin
    if o.page_set.all():
        first_page = o.page_set.all()[0]
        page_suffix = first_page.page_suffix 
    else:
        page_suffix = "01"        
    # Pequot version needs siteID in order to supress "go to full page"
    return render_to_response('documents/slim.html', {'resource_object': o, 
        'page_suffix': page_suffix, 'resource_type': 'document', 'siteid': settings.SITE_ID})

def doc_page(request, doc_short_name, page_suffix, doc_mode):
    """
	Supports Ajax call to replace current page
	"""
    d = get_object_or_404(Document, short_name=doc_short_name)
    if doc_mode == 'txt': # text
        if d.page_set.all():
            # get page record for this suffix
            curr_page = d.page_set.get(page_suffix=page_suffix)            
            transcript = curr_page.transcript
        else:
            transcript = "No transcription entered for this page."
        return render_to_response('documents/page_text.html', {'resource_object': d, 
            'page_suffix': page_suffix, 'doc_mode': doc_mode,'transcript': transcript})

    else: # image
        filename = d.filename + "_" + page_suffix
        return render_to_response('documents/page_image.html', {'resource_object': d, 
            'page_suffix': page_suffix, 'doc_mode': doc_mode,'filename': filename})

def zoom(request, short_name, page_suffix):
    """
	Supports js call to create new zoom window
	"""
    o = get_object_or_404(Document, short_name=short_name)
    return render_to_response('documents/zoom.html', {'resource_object': o, 'page_suffix': page_suffix})

def ideas(request, short_name):
    o = get_object_or_404(Document, short_name=short_name)
    idea_list = o.idea_set.all()
    title = o.title
    return render_to_response('connections/ideas.html', {'title': title, 'idea_list': idea_list})

def biblio(request, short_name):
    d = get_object_or_404(Document, short_name=short_name)
    source_list = d.biblio.filter(biblio_type="source")
    arts_list = d.biblio.filter(biblio_type="related_arts")
    item_title = d.title
    return render_to_response('connections/biblio.html', {'source_list': source_list, 
        'arts_list': arts_list, 'item_title': item_title})
