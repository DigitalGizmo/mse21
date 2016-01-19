from django.conf.urls import patterns, include, url
from django.conf import settings
from . import views

urlpatterns = patterns('documents.views',
    # url names must start with resource_type (per model.py _resource_type)
    url(r'^$', views.DocumentListView.as_view(), name='document_list'),
    url(r'^list/$', 'index_list'),
    url(r'^ideas/(?P<short_name>\S+)/$', 'ideas', name='document_ideas'),
    url(r'^biblio/(?P<short_name>\S+)/$', 'biblio', name='document_biblio'),
    url(r'^slim/(?P<short_name>\S+)/$', 'slim'),
    # add file_name, though not used, to fit url needed for JavaScript
    url(r'^hnav/(?P<short_name>\S+)/$', 
        views.DetailListView.as_view(template_name="collection_items_common/_hnav_list.html"), 
        name='hnav_list'),
    url(r'^(?P<doc_short_name>\S+)/(?P<page_suffix>\S+)/(?P<filename>\S+)/$', 'doc_page'), 
    url(r'^(?P<short_name>\S+)/$', 
        views.DetailListView.as_view(template_name="documents/document_detail.html"), 
        name='document_detail'),
)


