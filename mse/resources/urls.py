from django.conf.urls import patterns, include, url
from django.conf import settings
from . import views


urlpatterns = patterns('resources.views',
    # url(r'^$', 'index'),
    url(r'^$', views.ResourcesetListView.as_view(), name='resourceset_list'),
    url(r'^list/$', 'index_list'),
    url(r'^biblio/(?P<short_name>\S+)/$', 'biblio', name='resourceset_biblio'),
    url(r'^ideas/(?P<short_name>\S+)/$', 'ideas', name='resourceset_ideas'),
    url(r'^(?P<short_name>\S+)/$', 'detail', name='resourceset_detail'),
)

