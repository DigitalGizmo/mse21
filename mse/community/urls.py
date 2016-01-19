from django.conf.urls import patterns, include, url
from django.conf import settings
from . import views

urlpatterns = patterns('community.views',
    #url(r'^$', 'index'),
    url(r'^$', views.ProfileListView.as_view(), name='community_list'),
    url(r'^profiles/(?P<short_name>\S+)/$', 'profile', name='profile_detail'),
    #url(r'^projects/(?P<short_name>\S+)/$', 'project', name='project_detail'),
    url(r'^projects/(?P<slug>\S+)/$', views.ProjectDetailView.as_view(), name='project_detail'),
)

