from django.conf.urls import patterns, include, url
from django.conf import settings


urlpatterns = patterns('maps.views',
    url(r'^$', 'index'),
    url(r'^ideas/(?P<short_name>\S+)/$', 'ideas'),
    url(r'^biblio/(?P<short_name>\S+)/$', 'biblio'),
    url(r'^about/(?P<short_name>\S+)/$', 'about'),
    url(r'^voyage/(?P<short_name>\S+)/$', 'voyage'),
    url(r'^story/(?P<short_name>\S+)/$', 'story'),
    url(r'^storyprint/(?P<short_name>\S+)/$', 'storyprint'),
    url(r'^storylarge/(?P<short_name>\S+)/(?P<chap_num>\d+)/$', 'storylarge'),
    url(r'^journal/(?P<short_name>\S+)/(?P<page_num>\d+)/$', 'journal_page'),
    url(r'^compare/(?P<short_name>\S+)/(?P<map_id>\d+)/$', 'compare_this'),
    url(r'^compare/(?P<short_name>\S+)/$', 'compare'),
    #url(r'^(?P<short_name>\S+)/(?P<map_type>\S+)/$', 'logbook'),
    url(r'^(?P<short_name>\S+)/$', 'detail'),
)

