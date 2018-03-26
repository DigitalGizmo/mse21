from django.contrib import admin
from .models import Video

class VideoAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,            {'fields': ['title', 'short_name','producer', 'video_source', 
            'narrative']}),
        ##('Content Creator(s)',   {'fields': ['profiles', 'read_by'], 'classes': ['collapse']}),
        ('Resource Sets',   {'fields': ['resourcesets'], 'classes': ['collapse']}),
        ('Related Items from Collection',   {'fields': ['artifacts', 'documents'], 
        	'classes': ['collapse']}),
        ('Related Resources',   {'fields': ['biblio','essays', 'audiovisuals', 'lectures', 
            'maps', 'videos'], 'classes': ['collapse']}),
        ('Related Lesson, other PDFs',   {'fields': ['connections', 'lessons'], 'classes': 
            ['collapse']}),
        ('Weblinks',   {'fields': ['weblinks'], 'classes': ['collapse']}),
        ('Behind the scenes',   {'fields': ['ordinal', 'edit_date', 'status_num', 
            'edited_by', 'notes'], 'classes': ['collapse']}),
    ]
    list_display = ('title', 'short_name', 'video_source', 'status_num')  
    ##list_filter	 = ['augmented']
    search_fields = ['title', 'short_name']
    filter_horizontal = ['resourcesets','artifacts', 'documents', 'connections','weblinks',
        'biblio', 'essays', 'audiovisuals', 'lectures', 'maps', 'lessons', 'videos']

admin.site.register(Video, VideoAdmin)
