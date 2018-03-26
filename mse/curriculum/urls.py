from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.LessonListView.as_view(), name='lesson_list'),
    url(r'^lesson/biblio/(?P<short_name>\S+)/$', views.biblio, name='lesson_biblio'),
    url(r'^lesson/(?P<slug>\S+)/$', views.LessonDetailView.as_view(), 
        name='lesson_detail'),
]
