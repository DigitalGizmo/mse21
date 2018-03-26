from django.conf.urls import url
from . import views

urlpatterns = [
    # url(r'^$', 'index'),
    url(r'^$', views.ResourcesetListView.as_view(), name='resourceset_list'),
    url(r'^list/$', views.index_list),
    url(r'^biblio/(?P<short_name>\S+)/$', views.biblio, name='resourceset_biblio'),
    url(r'^ideas/(?P<short_name>\S+)/$', views.ideas, name='resourceset_ideas'),
    url(r'^(?P<short_name>\S+)/$', views.detail, name='resourceset_detail'),
]
