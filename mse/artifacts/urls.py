from django.conf.urls import patterns, include, url
from django.conf import settings
from . import views


urlpatterns = patterns('artifacts.views',
    # url(r'^$', 'index'),
    url(r'^$', views.ArtifactListView.as_view(), name='artifacts'),
    url(r'^raw/$', 'index_raw'),
    url(r'^list/$', 'index_list'),
    url(r'^ideas/(?P<short_name>\S+)/$', 'ideas'),
    url(r'^biblio/(?P<short_name>\S+)/$', 'biblio'),
    url(r'^slim/(?P<short_name>\S+)/$', 'slim'),
    #url(r'^raw/(?P<short_name>\S+)/$', 'detail_raw'),
    url(r'^zoom/(?P<short_name>\S+)/(?P<page_suffix>\S+)/$', 'zoom'),
    url(r'^(?P<short_name>\S+)/(?P<page_suffix>\S+)/$', 'artifact_view'),
    url(r'^(?P<short_name>\S+)/$', 'detail'),
    #url(r'^$', 'list'),
)

