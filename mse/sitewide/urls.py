from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.HomeTemplateView.as_view(), name='home'),
    url(r'^search/$', views.SearchListView.as_view(), name='search_list'),
]
