from connections.models import Connection, Weblink, Biblio, Essay, Moreinfo, Audiovisual, Slide
from documents.models import Document

from django.contrib import admin
# for modifying text fields - formfield_overrides
from django.forms import TextInput, Textarea
from django.db import models

class ConnectionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,                  {'fields': ['link_text', 'to_short_name']}),
        ('Behind the scenes',   {'fields': ['link_heading', 'edit_date']}),
    ]
    list_display = ( 'link_text', 'to_short_name','link_heading', 'edit_date')
    list_filter	 = ['link_heading']
    search_fields = ['link_text']

admin.site.register(Connection, ConnectionAdmin)


class WeblinkAdmin(admin.ModelAdmin):
    fields = ['link_text', 'link_url', 'description']
    list_display = ( 'link_text', 'link_url')
    search_fields = ['link_text']
admin.site.register(Weblink, WeblinkAdmin)

class BiblioAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,                  {'fields': ['title', 'citation']}),
        ('Behind the scenes',   {'fields': ['biblio_type']}),
    ]
    list_display = ( 'title', 'citation', 'biblio_type')
    list_filter  = ['biblio_type']
    search_fields = ['title']
    def get_form(self, request, obj=None, **kwargs):
        form = super(BiblioAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title'].widget.attrs['style'] = 'width: 50em;'
        form.base_fields['citation'].widget.attrs['style'] = 'width: 80em;'
        return form
admin.site.register(Biblio, BiblioAdmin)

class EssayAdmin(admin.ModelAdmin):
    fields = ['title', 'short_name', 'narrative']
    list_display = ('title', 'short_name')
admin.site.register(Essay, EssayAdmin)

class MoreinfoAdmin(admin.ModelAdmin):
    fields = ['short_name', 'title', 'has_image', 'credit_line', 'narrative']
    list_display = ( 'short_name', 'title')
    search_fields = ['title', 'short_name']
    
admin.site.register(Moreinfo, MoreinfoAdmin)

class SlideInline(admin.StackedInline):
    model = Slide
    extra = 2

class AudiovisualAdmin(admin.ModelAdmin):
    fields = ['short_name', 'title', 'media_type', 'credit_line', 'narrative']
    inlines = [SlideInline]
    list_display = ( 'short_name', 'title', 'media_type')
    list_filter	 = ['media_type']
admin.site.register(Audiovisual, AudiovisualAdmin)
