from django.conf.urls import patterns, include, url
from django.conf import settings
from . import views


urlpatterns = patterns('videos.views',
    url(r'^$', 
    	views.VideoListView.as_view(), name='video_list'),
    url(r'^biblio/(?P<short_name>\S+)/$', 'biblio', name='video_biblio'),
    # This project wasn't set up with the slug field name, view will convert
    url(r'^(?P<short_name>\S+)/$', 
    	views.VideoDetailView.as_view(), name='video_detail'),
)

