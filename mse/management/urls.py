from django.conf.urls import patterns, include, url
from django.conf import settings


urlpatterns = patterns('management.views',
    url(r'^$', 'index'),
    url(r'^collect/$', 'collect'),
    #url(r'^test_mail/$', 'test_mail'),
)
