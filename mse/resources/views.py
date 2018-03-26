from django.shortcuts import render, get_object_or_404
# from django.template import Context, loader
from django.views import generic
from django.conf import settings
from resources.models import Resourceset
from core.views import MenuInfoMixin

# map_list shows in set, maps shows in sidebar

class ResourcesetListView(MenuInfoMixin, generic.ListView):
    queryset = Resourceset.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    # paginate_by = 12
    context_object_name = 'resource_object_list'
    # template_name = 'resources/resourceset_list.html' # default
    menu_type = 'resourceset'
    main_nav_selected = 'resourcesets'


def index_list(request):
    resource_object_list = Resourceset.objects.all().order_by('ordinal')
    return render(request, 'resources/index_list.html', {'resource_object_list': 
        resource_object_list})

def detail(request, short_name):
    """
    Ideally this should be refactored into CBV, but I'm not sure if it's worth it unless
    I can do the settings filter in the model
    main_nav_selected is tacked on.
    """ 
    o = get_object_or_404(Resourceset, short_name=short_name)
    artifact_list = o.artifact_set.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')  
    document_list = o.document_set.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')  
    map_list = o.geomap_set.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')  
    lecture_list = o.lecture_set.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')  

    return render(request, 'resources/resourceset_detail.html', {'resource_object': 
        o, 'artifact_list': artifact_list, 'document_list': document_list, 
        'map_list': map_list, 'lecture_list': lecture_list, 'main_nav_selected': 'resourcesets'})

def ideas(request, short_name):
    o = get_object_or_404(Resourceset, short_name=short_name)
    idea_list = o.idea_set.all()
    title = o.title
    return render(request, 'connections/ideas.html', {'title': title, 'idea_list': idea_list})


def biblio(request, short_name):
    o = get_object_or_404(Resourceset, short_name=short_name)
    source_list = o.biblio.filter(biblio_type="source")
    arts_list = o.biblio.filter(biblio_type="related_arts")
    item_title = o.title
    return render(request, 'connections/biblio.html', {'source_list': source_list, 
        'arts_list': arts_list, 'item_title': item_title})
