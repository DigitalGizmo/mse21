from django.conf.urls import url
from . import views

urlpatterns = [
    #url(r'^$', 'index'),
    url(r'^$', views.ProfileListView.as_view(), name='community_list'),
    url(r'^profiles/(?P<short_name>\S+)/$', views.profile, name='profile_detail'),
    url(r'^projects/biblio/(?P<short_name>\S+)/$', views.biblio, name='project_biblio'),
    url(r'^projects/(?P<slug>\S+)/$', views.ProjectDetailView.as_view(), name='project_detail'),
]
