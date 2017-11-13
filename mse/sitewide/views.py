from itertools import chain
from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.views.generic.edit import FormMixin
from django.apps import apps
from django.db.models import Q
from datetime import date

from django.conf import settings
from sitewide.models import Featured
from about.models import Event
from core.views import MenuInfoMixin
from .forms import SearchForm
from artifacts.models import Artifact
from documents.models import Document

class HomeTemplateView(generic.TemplateView):
    """
    tryptic_list, and new_list are accessed from the instance of the banner_item.
    Exception messages require two entries in admin sitewide > 
    Featured: banner_error_none and
    banner_error_multi. 
    """
    # filter for events that belong on home page
    # queryset = Event.objects.filter(on_home=True)

    # handle pequot home or MSE home
    if settings.SITE_ID == 2:
        template_name = 'pq/index.html' 
    else:
        # MSE site
        template_name = 'index.html' 
        # obsolete, not using event list: context_object_name = 'event_list' # use default

        def get_context_data(self, **kwargs):
            # Call the base implementation first to get a context
            context = super(HomeTemplateView, self).get_context_data(**kwargs)

            # get current events list
            context['current_events'] = Event.objects.filter(start_date__gte=date.today())

            # Get banner_item and other featured
            # banner_item might better be called featured_object.
            # Single banner instance will provide access to tryptic and 
            # new list properties, as deined in the model
            try:
                context['banner_item'] = Featured.objects.get(display_status = 3)
                # also set main nav highlight
                context['main_nav_selected'] = 'home'
                # return context
            except Featured.DoesNotExist:
                context['banner_item'] = Featured.objects.get(short_name = 
                    'banner_error_none')
                return context
            except Featured.MultipleObjectsReturned:
                context['banner_item'] = Featured.objects.get(short_name = 
                    'banner_error_multi')
                return context

            return context


class SearchListView(MenuInfoMixin, FormMixin, generic.ListView):
    """
    On initial display the checkboxes will be empty, the form not bound (not valid),
    but we will show results for all. Checkboxes will narrow results
    Following http://schinckel.net/2014/08/17/leveraging-html-and-django-
        forms%3A-pagination-of-filtered-results/

    """
    form_class=SearchForm
    template_name='sitewide/search_list.html'
    # queryset=Artifact.objects.all()
    context_object_name = 'resource_object_list'
    paginate_by=20
    menu_type='search'
    # specific to methods below
    init_data = {'q': ''}
    all_rts = {'rts': ['m', 'l', 'i', 'd', 'a']}
    resource_types = {'a': ['artifacts', 'artifact'], 'd': ['documents', 'document'], 
        'm': ['maps', 'geomap'], 'l': ['scholars', 'lecture'], 
        'i': ['scholars', 'interview'], }

    def get_form_kwargs(self):
        return {
            'initial': self.get_initial(), # won't be using this
            'prefix': self.get_prefix(),  # don't know what this is
            'data': self.request.GET or self.init_data  #  None
        }
    
    def get(self, request, *args, **kwargs):
        # get starting query set -- hopefully won't need this
        # self.object_list = self.get_queryset()
        # get the form
        form = self.get_form(self.get_form_class())

        queryset_list= []

        # may be overwritten in is_valid
        rt_list = self.all_rts['rts']
        # q needs to be defined for initial case
        q = self.request.GET.get("q")

        # for submissions after initial display
        if form.is_valid():
            # print(' -------- form valid ----')
            q = form.cleaned_data['q']

            # empty list means all
            submitted_list = form.cleaned_data['rts']
            if len(submitted_list) > 0:
                rt_list = submitted_list
            # else we have the rt_list as set by all_rts 

        # outside of is_valid for initial display

        print(' -------- rt_id in enumerate(rt_list) ----' + rt_list[0])

        for i, rt_id in enumerate(rt_list):
            print('rt app, type: ' + self.resource_types[rt_id][0])

            # get queryset for this type
            app_namespace = self.resource_types[rt_id][0]
            resource_type = self.resource_types[rt_id][1]
            # retrieve item model
            ItemModel = apps.get_model(app_label=app_namespace, 
                    model_name=resource_type)
            # get queryset
            _queryset = ItemModel.objects.filter( 
                status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
            # filter if q
            # workaround the differences in searchable fieldnames
            if q:
                if rt_id == 'i':               
                    _queryset = _queryset.filter(Q(scholar__icontains=q) | 
                        Q(narrative__icontains=q))
                else:
                    _queryset = _queryset.filter(Q(title__icontains=q) | 
                        Q(narrative__icontains=q))

            # and append
            queryset_list.append(_queryset)

            # result_list = list(chain(queryset_list[0], queryset_list[1]))
            result_list = list(chain.from_iterable(queryset_list))

            self.object_list = result_list

        context = self.get_context_data(form=form)
        context['result_count'] = len(result_list)
        return self.render_to_response(context)

