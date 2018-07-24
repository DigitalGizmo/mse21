from django.conf.urls import url
from . import views

app_name = "scholars"

# Lectures and interviews urls are pre-pended with "scholars" for reasons of a) legacy, 
# b) pequot version of site.
urlpatterns = [
    # url(r'^$', 'index'),
    url(r'^lectures/$', views.LectureListView.as_view(), name='lecture_list'),
    url(r'^interviews/$', views.InterviewListView.as_view(), name='interview_list'),
    url(r'^lectures/biblio/(?P<short_name>\S+)/$', views.biblio, name='lecture_biblio'),
    url(r'^lectures/ideas/(?P<short_name>\S+)/$', views.ideas, name='lecture_ideas'),
    url(r'^lectures/(?P<slug>\S+)/$', views.LectureDetailView.as_view(), name='lecture_detail'),
    url(r'^interviews/(?P<short_name>\S+)/(?P<question_num>\d+)/$', views.inter_view),
    url(r'^interviews/(?P<short_name>\S+)/$', views.interview, name='interview_detail'),
]
