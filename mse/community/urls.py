from django.conf.urls import patterns, include, url
from django.conf import settings

urlpatterns = patterns('community.views',
    url(r'^$', 'index'),
    url(r'^profiles/(?P<short_name>\S+)/$', 'profile'),
    url(r'^projects/(?P<short_name>\S+)/$', 'project'),
)

