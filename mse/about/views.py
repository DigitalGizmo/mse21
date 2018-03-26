from django.shortcuts import render
from django.views import generic
from .models import Event, Scene, Single
from core.views import MenuInfoMixin


class EventListView(MenuInfoMixin, generic.ListView):
    model = Event
    context_object_name = 'resource_object_list'
    # template_name = 'about/event_list.html' # default
    menu_type='event'


class EventDetailView(MenuInfoMixin, generic.DetailView):
    model = Event
    slug_field = 'short_name'
    context_object_name = 'resource_object'
    # template_name = 'about/event_detail.html' # default
    menu_type='event'


class SceneListView(MenuInfoMixin, generic.ListView):
    model = Scene
    context_object_name = 'resource_object_list'
    # template_name = 'about/scene_list.html' # default
    menu_type='scene'


class SceneDetailView(MenuInfoMixin, generic.DetailView):
    model = Scene
    slug_field = 'short_name'
    context_object_name = 'resource_object'
    # template_name = 'about/event_detail.html' # default
    menu_type='scene'


class SingleDetailView(MenuInfoMixin, generic.DetailView):
    model = Single
    slug_field = 'short_name'
    context_object_name = 'resource_object'
    # template_name = 'about/single_detail.html' # default
    menu_type='scene'
