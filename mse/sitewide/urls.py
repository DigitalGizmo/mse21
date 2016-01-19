from django.conf.urls import patterns, include, url
from . import views


urlpatterns = patterns('sitewide.views',
    url(r'^$', views.HomeListView.as_view(), name='home'),
    url(r'^search/$', views.SearchListView.as_view(), name='search_list'),
    #url(r'^search/$', views.SearchView.as_view(), name='search_list'),
    #url(r'^search/$', 'search_list', name='search_list'),
)

