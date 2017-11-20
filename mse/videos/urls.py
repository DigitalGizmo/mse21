from django.conf.urls import patterns, include, url
from django.conf import settings
from . import views


urlpatterns = patterns('videos.views',
    url(r'^$', 
    	views.VideoListView.as_view(), name='video_list'),
    # This project wasn't set up with the slug field name, view will convert
    url(r'^(?P<slug>\S+)/$', 
    	views.VideoDetailView.as_view(), name='video_detail'),
)

