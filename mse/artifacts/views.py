from django.shortcuts import render_to_response, get_object_or_404
# from django.template import Context, loader
from django.views import generic
from django.conf import settings
from artifacts.models import Artifact
from core.views import MenuInfoMixin, CollectionSearchMixin, ItemDetailMixin


class ArtifactListView(CollectionSearchMixin, MenuInfoMixin, generic.ListView):
    """
    Shares template with Living Documents menu/list
    Queryset will be filtered further by CollectionSearchMixin
    """
    queryset = Artifact.objects.filter( 
        status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    paginate_by = 12
    context_object_name = 'resource_object_list'
    template_name = 'collection_items_common/list_basic_grid.html'
    # set menu_type for MenuInfoMixin
    menu_type='artifact'


def index_list(request):
    resource_object_list = Artifact.objects.all().order_by('id_number')
    return render_to_response('artifacts/index_list.html', 
        {'resource_object_list': resource_object_list})


class DetailListView(CollectionSearchMixin, ItemDetailMixin, MenuInfoMixin, generic.ListView):
    """
    ListView, using CollectionSearchMixin, gets the current item search set for the 
    horizontal nav. This gets horizontal nav list as well as item detail.
    The params (aug, q and page) are handled by the form.
    """
    queryset = Artifact.objects.filter( 
        status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    paginate_by = 4
    context_object_name = 'resource_object_list'
    # template name set in urlconf
    # template_name = 'artifacts/artifact_detail.html'
    # template has conditions to handle diffs for raw artifacts
    # set resource_type for ItemParamMixin
    resource_type = "artifact"
    # set menu_type for MenuInfoMixin
    menu_type='artifact'


def slim(request, short_name):
    o = get_object_or_404(Artifact, short_name=short_name)
    # a condition in slim.html checks for o.is_vertical
    # Pequot version needs siteID in order to supress "go to full page"
    return render_to_response('artifacts/slim.html', {'resource_object': o, 
        'siteid': settings.SITE_ID})

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

