from django.shortcuts import render, get_object_or_404
#from django.template import Context, loader
from django.views import generic
from django.conf import settings
from documents.models import Document
from core.views import MenuInfoMixin, CollectionSearchMixin, ItemDetailMixin

class DocumentListView(CollectionSearchMixin, MenuInfoMixin, generic.ListView):
    """
    Shares template with Artifact Article menu/list
    Queryset will be filtered further by CollectionSearchMixin
    """
    queryset = Document.objects.filter( 
        status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    paginate_by = 12
    context_object_name = 'resource_object_list'
    template_name = 'collection_items_common/list_basic_grid.html'
    # for MenuInfoMixin 
    menu_type='document'
    main_nav_selected = 'resources'

 
def index_list(request):
    resource_object_list = Document.objects.all().order_by('identifier')
    return render(request, 'documents/index_list.html', 
        {'resource_object_list': resource_object_list})


class DetailListView(CollectionSearchMixin, ItemDetailMixin, MenuInfoMixin, generic.ListView):
    """
    Gets horizontal nav list as well as item detail 
    The params (aug, q and page) need to go into the context here since
    request.GET doesn't work in the ajax call.
    curr_page context variable is used only when called as full detail page.
    When called has hnav, that variable is ignored (simply not used)
    """
    queryset = Document.objects.filter( 
        status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    paginate_by = 4
    context_object_name = 'resource_object_list'
    # template name set in urlconf
    # template_name = 'artifacts/artifact_detail.html'
    # template has conditions to handle diffs for raw artifacts
    # set resource_type for ItemParamMixin
    resource_type = "document"
    # set menu_type for MenuInfoMixin
    menu_type='document'

    # Document needs doc page info in addition to what an artifact needs
    def get_context_data(self, **kwargs):
         # Call the base implementation first to get a context
        context = super(DetailListView, self).get_context_data(**kwargs)
        # get short_name from URLconf and then object
        short_name = self.kwargs['short_name']
        resource_object = get_object_or_404(Document, short_name=short_name)
        # get first page 
        try:        
            curr_page = resource_object.first_page
        except:
            return render(request, 'error_msg.html', 
                {'msg':'Document entry in Admin must define at least one Page.'})
        # set the context variable
        context['curr_page'] = curr_page

        return context


def doc_page(request, doc_short_name, page_suffix, filename):
    """
	Supports Ajax call to replace current page
    filename param not used here. It's in the url for use by JS 
    that switches the zoomify image. By putting all the info in one url
    I don't need to split it in JS. And the url will work as a non-js fallback.
	"""
    d = get_object_or_404(Document, short_name=doc_short_name)

    # get page record for this suffix
    curr_page = d.page_set.get(page_suffix=page_suffix)            

    return render(request, 'documents/_page_text.html', {'resource_object': d, 
        'curr_page': curr_page})

def slim(request, short_name):
    o = get_object_or_404(Document, short_name=short_name)

    # get first page 
    try:        
        curr_page = o.first_page
    except:
        return render(request, 'error_msg.html', 
            {'msg':'Document entry in Admin must define at least one Page.'})

    # Pequot version needs siteID in order to supress "go to full page"
    return render(request, 'documents/slim.html', {'resource_object': o, 
        'curr_page': curr_page, 'siteid': settings.SITE_ID})


def ideas(request, short_name):
    o = get_object_or_404(Document, short_name=short_name)
    idea_list = o.idea_set.all()
    title = o.title
    return render(request, 'connections/ideas.html', {'title': title, 
        'idea_list': idea_list})


def biblio(request, short_name):
    d = get_object_or_404(Document, short_name=short_name)
    source_list = d.biblio.filter(biblio_type="source")
    arts_list = d.biblio.filter(biblio_type="related_arts")
    item_title = d.title
    return render(request, 'connections/biblio.html', {'source_list': source_list, 
        'arts_list': arts_list, 'item_title': item_title})
