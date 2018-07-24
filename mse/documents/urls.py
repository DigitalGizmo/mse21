from django.conf.urls import url
from . import views

app_name = "documents"

urlpatterns = [
    # url names must start with resource_type (per model.py _resource_type)
    url(r'^$', views.DocumentListView.as_view(), name='document_list'),
    url(r'^list/$', views.index_list),
    url(r'^ideas/(?P<short_name>\S+)/$', views.ideas, name='document_ideas'),
    url(r'^biblio/(?P<short_name>\S+)/$', views.biblio, name='document_biblio'),
    url(r'^slim/(?P<short_name>\S+)/$', views.slim),
    # add file_name, though not used, to fit url needed for JavaScript
    url(r'^hnav/(?P<short_name>\S+)/$', 
        views.DetailListView.as_view(template_name="collection_items_common/_hnav_list.html"), 
        name='hnav_list'),
    url(r'^(?P<doc_short_name>\S+)/(?P<page_suffix>\S+)/(?P<filename>\S+)/$', views.doc_page), 
    url(r'^(?P<short_name>\S+)/$', 
        views.DetailListView.as_view(template_name="documents/document_detail.html"), 
        name='document_detail'),
]
