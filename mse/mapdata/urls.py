from django.conf.urls import url
from . import views

app_name = "mapdata"

urlpatterns = [
    url(r'^voyage/(?P<voyageid>\S+)/(?P<year>\d+)/(?P<mode_col_name>\S+)/$', views.voyage_year_mode_entries),
    url(r'^voyage/(?P<voyageid>\S+)/(?P<year>\d+)/$', views.voyage_year_entries),
    url(r'^voyage/compare/(?P<voyageid>\S+)/$', views.compare_voyage_entries),
    url(r'^voyage/(?P<voyageid>\S+)/$', views.voyage_entries),
]
