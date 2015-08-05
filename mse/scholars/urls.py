from django.conf.urls import patterns, include, url
from django.conf import settings

# Lectures and interviews urls are pre-pended with "scholars" for reasons of a) legacy, b) pequot version of site.
urlpatterns = patterns('scholars.views',
    url(r'^$', 'index'),
    url(r'^lectures/$', 'lecture_index'),
    url(r'^interviews/$', 'interview_index'),
    url(r'^lectures/biblio/(?P<short_name>\S+)/$', 'biblio'),
    url(r'^lectures/ideas/(?P<short_name>\S+)/$', 'ideas'),
    url(r'^lectures/(?P<short_name>\S+)/$', 'lecture'),
    url(r'^interviews/(?P<short_name>\S+)/(?P<question_num>\d+)/$', 'inter_view'),
    url(r'^interviews/(?P<short_name>\S+)/$', 'interview'),
)

