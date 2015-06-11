from django.conf.urls import include, url
from django.contrib import admin
# from django.views.generic.simple import direct_to_template

urlpatterns = [
    # Examples:
    # url(r'^$', 'mse.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    #url(r'^robots\.txt$', direct_to_template, {'template': 'robots.txt', 'mimetype':'text/plain'}),  
    url(r'^$', 'general.views.index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^artifacts/', include('artifacts.urls')),
    url(r'^community/', include('community.urls')),
    url(r'^connections/', include('connections.urls')),
    url(r'^documents/', include('documents.urls')),
    url(r'^maps/', include('maps.urls')),
    url(r'^sets/', include('resources.urls')),
    url(r'^scholars/', include('scholars.urls')),
    #url(r'^tinymce/', include('tinymce.urls')),
    url(r'^management/', include('management.urls')),

]
