from community.models import Profile, Project

from django.contrib import admin

class ProfileAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,            {'fields': ['profile_name', 'short_name', 'institution', 
            'location', 'is_institution', 'narrative']}),
        ('Behind the scenes',   {'fields': ['ordinal', 'edit_date', 'status_num', 
            'edited_by', 'notes'], 'classes': ['collapse']}),
    ]
    list_display = ('profile_name', 'short_name', 'status_num')
    #list_filter	 = ['scholar_short_name']
    # filter_horizontal = ['projects']
admin.site.register(Profile, ProfileAdmin)

class ProjectAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,            {'fields': ['title', 'subtitle', 'short_name', 'narrative']}),
        ('Content Creator(s)',   {'fields': ['profiles'], 'classes': ['collapse']}),
        ('Resource Sets',   {'fields': ['resourcesets'], 'classes': ['collapse']}),
        ('Related Items from Collection',   {'fields': ['artifacts', 'documents'], 
            'classes': ['collapse']}),
        ('Related Resources',   {'fields': ['biblio','essays', 'audiovisuals', 
            'lectures', 'maps'], 'classes': ['collapse']}),
        ('Related Lesson, other PDFs',   {'fields': ['connections', 'lessons'], 
            'classes': ['collapse']}),
        ('Weblinks',   {'fields': ['weblinks'], 'classes': ['collapse']}),
        ('Behind the scenes',   {'fields': ['ordinal', 'edit_date', 'status_num', 
            'edited_by', 'notes'], 'classes': ['collapse']}),
    ]
    list_display = ('title', 'short_name', 'status_num')
    #list_filter	 = ['scholar_short_name']
    filter_horizontal = ['resourcesets','artifacts', 'documents', 'connections','weblinks',
    'biblio', 'essays', 'audiovisuals', 'lectures', 'maps','profiles', 'lessons']
admin.site.register(Project, ProjectAdmin)

