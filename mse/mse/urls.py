from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

# from sitewide.views import HomeListView

"""
hame page treatment is experimental.
May need to include sitewide urls
"""

urlpatterns = [
    url(r'^robots\.txt$', TemplateView.as_view(template_name='robots.txt', content_type='text/plain')),  
    #url(r'^$', 'sitewide.views.index'),
    #url(r'^$', HomeListView.as_view(), name='home'),
    url(r'^', include('sitewide.urls', namespace='sitewide')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^about/', include('about.urls', namespace='about')),
    url(r'^artifacts/', include('artifacts.urls', namespace='artifacts')),
    url(r'^community/', include('community.urls', namespace='community')),
    url(r'^connections/', include('connections.urls', namespace='connections')),
    url(r'^curriculum/', include('curriculum.urls', namespace='curriculum')),
    url(r'^documents/', include('documents.urls', namespace='documents')),
    url(r'^maps/', include('maps.urls', namespace='maps')),
    url(r'^sets/', include('resources.urls', namespace='resources')),
    url(r'^scholars/', include('scholars.urls', namespace='scholars')),
    url(r'^videos/', include('videos.urls', namespace='videos')),
    #url(r'^tinymce/', include('tinymce.urls')),
]
