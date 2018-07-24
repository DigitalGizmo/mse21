from django.conf.urls import url
from . import views

app_name = "connections"

urlpatterns = [
    url(r'^essays/(?P<short_name_param>\S+)/$', views.essay),
    url(r'^moreinfo/(?P<short_name_param>\S+)/$', views.moreinfo),
    url(r'^attractloop/(?P<slide_num>\S+)/$', views.loop),
    url(r'^slideshow/slide/(?P<short_name_param>\S+)/(?P<slide_num>\d+)/$', views.slides),
    # separate url for each media/audiovisual type
    url(r'^slideshow/(?P<short_name_param>\S+)/$', views.slides),
    url(r'^image/(?P<short_name_param>\S+)/$', views.audiovisual),
    url(r'^video/(?P<short_name_param>\S+)/$', views.audiovisual),
    url(r'^audio/(?P<short_name_param>\S+)/$', views.audiovisual),
]
