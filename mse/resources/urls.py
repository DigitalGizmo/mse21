from django.conf.urls import patterns, include, url
from django.conf import settings


urlpatterns = patterns('resources.views',
    url(r'^$', 'index'),
    url(r'^list/$', 'index_list'),
    url(r'^biblio/(?P<short_name>\S+)/$', 'biblio'),
    url(r'^ideas/(?P<short_name>\S+)/$', 'ideas'),
    url(r'^(?P<short_name>\S+)/$', 'detail'),
)

