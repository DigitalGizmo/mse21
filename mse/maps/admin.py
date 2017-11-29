from maps.models import Geomap, Idea, Logyear, Comparevoyage, Chapter

from django.contrib import admin

class IdeaInline(admin.TabularInline):
    model = Idea
    extra = 2

class LogyearInline(admin.TabularInline):
    model = Logyear
    extra = 2

class ComparevoyageInline(admin.TabularInline):
    model = Comparevoyage
    extra = 1

class ChapterInline(admin.StackedInline):
    model = Chapter
    extra = 1

class GeomapAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,            {'fields': ['title', 'subtitle', 'short_name', 'map_type', 
            'init_lat', 'init_long', 'init_zoom', 'fusion_table_id', 'date_range', 
            'description', 'caption', 'credit', 'log_link_type', 'sites']}),
        (None,            {'fields': ['narrative']}),
        ('Content Creator(s)',   {'fields': ['profiles'], 'classes': ['collapse']}),
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
    inlines = [IdeaInline, LogyearInline, ComparevoyageInline, ChapterInline]
    list_display = ('title', 'short_name', 'map_type', 'status_num', 'edit_date')
    list_filter	 = ['map_type']
    filter_horizontal = ['resourcesets', 'artifacts', 'documents', 'connections', 'weblinks', 
    'biblio', 'essays', 'audiovisuals', 'lectures', 'maps', 'profiles', 'sites', 'lessons', 
    'videos']

admin.site.register(Geomap, GeomapAdmin)

