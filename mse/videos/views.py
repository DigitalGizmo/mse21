from django.shortcuts import render
from django.conf import settings
from django.views.generic import ListView, DetailView
from .models import Video
from core.views import MenuInfoMixin

class VideoListView(MenuInfoMixin, ListView):
    # model = Video
    queryset = Video.objects.filter(status_num__gte=settings.STATUS_LEVEL)
    context_object_name = 'resource_object_list'
    # template_name = 'videos/video_list.html' 
    menu_type='video'


class VideoDetailView(MenuInfoMixin, DetailView):
    model = Video
    slug_field = 'short_name'
    context_object_name = 'resource_object'
    # template_name = 'videos/video_detail.html'
    menu_type='video'
