from django.conf.urls import patterns, include, url
from django.conf import settings


urlpatterns = patterns('connections.views',
    url(r'^essays/(?P<short_name_param>\S+)/$', 'essay'),
    url(r'^moreinfo/(?P<short_name_param>\S+)/$', 'moreinfo'),
    url(r'^attractloop/(?P<slide_num>\S+)/$', 'loop'),
    url(r'^slideshow/slide/(?P<short_name_param>\S+)/(?P<slide_num>\d+)/$', 'slides'),
    # separate url for each media/audiovisual type
    # url(r'^media/(?P<short_name_param>\S+)/$', 'audiovisual'),
    url(r'^slideshow/(?P<short_name_param>\S+)/$', 'slides'),
    url(r'^image/(?P<short_name_param>\S+)/$', 'audiovisual'),
    url(r'^video/(?P<short_name_param>\S+)/$', 'audiovisual'),
    url(r'^audio/(?P<short_name_param>\S+)/$', 'audiovisual'),
)

