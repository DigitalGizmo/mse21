from django.shortcuts import get_object_or_404
from django.db.models import Q
#from django.db.models import Count
from django.views.generic.edit import FormMixin
from django.views.generic import ListView
from django.apps import apps
from sitewide.models import Menu
from artifacts.models import Artifact
from documents.models import Document
from .forms import ItemSearchForm



class MenuInfoMixin(object):
    """
    Gets menu title and blurb
    Instead of using resource_object_list.0.menu_info
    menu_type must be set in the main view
    Also pressed into service for the main nav highlighting. 
    """
    # get data for this menu type
    def get_context_data(self, **kwargs):
         # Call the base implementation first to get a context
        context = super(MenuInfoMixin, self).get_context_data(**kwargs)
        # get menu_info object and place in context - has title and blurb
        menu_info = get_object_or_404(Menu, short_name=self.menu_type)
        context['menu_info'] = menu_info
        # get main nav from parent view and put in context
        # Needs to be set in context directly (rather than being access through object)
        # as long as some of the detail pages are still FBVs, hence no access to this mixin
        context['main_nav_selected'] = menu_info.main_nav_name
        return context


class CollectionSearchMixin(FormMixin, ListView):
    """
    Used by Artifact and Docs, both Menu and Detail (with h-nav list)
    Patterned after sitewide SearchListView which..
    follows http://schinckel.net/2014/08/17/leveraging-html-and-django-
                    forms%3A-pagination-of-filtered-results/
    """
    form_class = ItemSearchForm

    # provide blank q so that placeholder attr will appear, rather than "None"
    # this init will only be used if there's no request.get
    init_data = {'q': '', 'aug': 'f'} # , 'sa': 'f'

    def get_form_kwargs(self):
        return {
            'initial': self.get_initial(), # won't be using this
            'prefix': self.get_prefix(),  # don't know what this is
            'data': self.request.GET or self.init_data # None  # will add my data here
        }
    
    def get(self, request, *args, **kwargs):
        # fetch the queryset from the parent get_queryset
        self.object_list = super(CollectionSearchMixin, self).get_queryset()
        # get the form
        form = self.get_form(self.get_form_class())

        if form.is_valid():

            print('-------- form is is_valid')

            # get params
            q = form.cleaned_data['q']
            aug = form.cleaned_data['aug']

            # initially there is no aug - default is "f"
            if aug == "r":
                self.object_list = self.object_list.filter(augmented=False)
            elif aug == "f":
                self.object_list = self.object_list.filter(augmented=True)
            # else - "a" - no further filtering

            if q:
                # Return a filtered queryset
                # This further filters the queryset above
                self.object_list = self.object_list.filter(Q(title__icontains=q) | 
                    Q(narrative__icontains=q))

        self.object_list = self.object_list.distinct()

        context = self.get_context_data(form=form)
        context['result_count'] = len(self.object_list)
        return self.render_to_response(context)


class ItemDetailMixin(object):
    """
    Retrieve the Artifact or Document resource_object.
    """
    # Get actual artifact or document and params
    def get_context_data(self, **kwargs):
         # Call the base implementation first to get a context
        context = super(ItemDetailMixin, self).get_context_data(**kwargs)
        # get short_name from URLconf
        short_name = self.kwargs['short_name']

        # resource_type set in artifact or doc DetailListView
        # derive app_namespace
        app_namespace = self.resource_type + "s"
        # retrieve item model
        ItemModel = apps.get_model(app_label=app_namespace, 
            model_name=self.resource_type)

        # get artifact or object for the detail view
        resource_object = get_object_or_404(ItemModel, short_name=short_name)
        context['resource_object'] = resource_object

        return context


