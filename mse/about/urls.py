from django.conf.urls import patterns, include, url
from . import views


urlpatterns = patterns('about.views',
    url(r'^events/$', views.EventListView.as_view(), name='event_list'),
    url(r'^events/(?P<slug>\S+)/$', views.EventDetailView.as_view(), 
                    name='event_detail'),
    url(r'^scenes/$', views.SceneListView.as_view(), name='scene_list'),
    url(r'^scenes/(?P<slug>\S+)/$', views.SceneDetailView.as_view(), 
                    name='scene_detail'),
    url(r'^(?P<slug>\S+)/$', views.SingleDetailView.as_view(), 
                    name='single_detail'),
)

