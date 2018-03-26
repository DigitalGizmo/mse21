from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='map_list'),
    url(r'^ideas/(?P<short_name>\S+)/$', views.ideas, name='geomap_ideas'),
    url(r'^biblio/(?P<short_name>\S+)/$', views.biblio, name='geomap_biblio'),
    url(r'^about/(?P<short_name>\S+)/$', views.about),
    url(r'^voyage/(?P<short_name>\S+)/$', views.voyage),
    url(r'^story/(?P<short_name>\S+)/$', views.story),
    url(r'^storyprint/(?P<short_name>\S+)/$', views.storyprint),
    url(r'^storylarge/(?P<short_name>\S+)/(?P<chap_num>\d+)/$', views.storylarge),
    url(r'^journal/(?P<short_name>\S+)/(?P<page_num>\d+)/$', views.journal_page),
    # url(r'^compare/(?P<short_name>\S+)/(?P<map_id>\d+)/(?P<voyageid>\S+)/$', views.compare_this),
    url(r'^compare/(?P<short_name>\S+)/(?P<voyageid>\S+)/$', views.compare_this),
    url(r'^compare/(?P<short_name>\S+)/$', views.compare),
    #url(r'^(?P<short_name>\S+)/(?P<map_type>\S+)/$', 'logbook'),
    url(r'^(?P<short_name>\S+)/$', views.detail, name='geomap_detail'),
]
