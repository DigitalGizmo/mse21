from django.conf.urls import url
from . import views

app_name = "videos"

urlpatterns = [
    url(r'^$', 
    	views.VideoListView.as_view(), name='video_list'),
    url(r'^biblio/(?P<short_name>\S+)/$', views.biblio, name='video_biblio'),
    # This project wasn't set up with the slug field name, view will convert
    url(r'^(?P<short_name>\S+)/$', 
    	views.VideoDetailView.as_view(), name='video_detail'),
]

