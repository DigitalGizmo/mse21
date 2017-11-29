from django.shortcuts import render, render_to_response, get_object_or_404
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
    slug_url_kwarg = 'short_name'
    context_object_name = 'resource_object'
    # template_name = 'videos/video_detail.html'
    # set resource_type for ItemParamMixin
    # resource_type = "video"
    # set menu_type for MenuInfoMixin
    menu_type='video'

def biblio(request, short_name):
    a = get_object_or_404(Video, short_name=short_name)
    source_list = a.biblio.filter(biblio_type="source")
    arts_list = a.biblio.filter(biblio_type="related_arts")
    item_title = a.title
    return render_to_response('connections/biblio.html', {'source_list': source_list, 
        'arts_list': arts_list, 'item_title': item_title})
