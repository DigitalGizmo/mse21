from django.conf.urls import patterns, include, url
from django.conf import settings
from . import views


urlpatterns = patterns('artifacts.views',
    # url names must start with resource_type (per model.py _resource_type)
    url(r'^$', 
    	views.ArtifactListView.as_view(), name='artifact_list'),
    url(r'^list/$', 'index_list'),
    url(r'^ideas/(?P<short_name>\S+)/$', 'ideas', name='artifact_ideas'),
    url(r'^biblio/(?P<short_name>\S+)/$', 'biblio', name='artifact_biblio'),
    url(r'^slim/(?P<short_name>\S+)/$', 'slim'),
    url(r'^hnav/(?P<short_name>\S+)/$', 
    	views.DetailListView.as_view(template_name="collection_items_common/_hnav_list.html"), 
    	name='hnav_list'),
    url(r'^(?P<short_name>\S+)/$', 
    	views.DetailListView.as_view(template_name="artifacts/artifact_detail.html"), 
    	name='artifact_detail'),
    #url(r'^$', 'list'),
)

