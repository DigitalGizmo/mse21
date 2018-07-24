from django.conf.urls import url
from . import views

app_name = "sitewide"

urlpatterns = [
    url(r'^$', views.HomeTemplateView.as_view(), name='home'),
    url(r'^search/$', views.SearchListView.as_view(), name='search_list'),
]
