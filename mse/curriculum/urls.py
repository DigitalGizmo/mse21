from django.conf.urls import patterns, include, url
from django.conf import settings
from . import views


urlpatterns = patterns('curriculum.views',
    url(r'^$', views.LessonListView.as_view(), name='lesson_list'),
    url(r'^lesson/biblio/(?P<short_name>\S+)/$', 'biblio', name='lesson_biblio'),
    url(r'^lesson/(?P<slug>\S+)/$', views.LessonDetailView.as_view(), 
        name='lesson_detail'),
)
