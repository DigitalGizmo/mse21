from django.contrib import admin

from .models import Gradelevel, Subject, Lesson, Supplement


class GradelevelAdmin(admin.ModelAdmin):
    fields = ['short_name', 'title', 'ordinal']
    list_display = ('short_name', 'title', 'ordinal')

admin.site.register(Gradelevel, GradelevelAdmin)


class SubjectAdmin(admin.ModelAdmin):
    fields = ['title', 'short_name', 'ordinal']
    list_display = ('short_name', 'title', 'ordinal')

admin.site.register(Subject, SubjectAdmin)


class SupplementInline(admin.TabularInline):
    model = Supplement
    extra = 2


class LessonAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,  {'fields': ['title', 'subtitle', 'short_name', 'narrative', 'gradelevels', 'subjects',
        'profiles']}),
        ('Related Items from Collection',   {'fields': ['artifacts', 'documents'], 
            'classes': ['collapse']}),
        ('Related Resources',   {'fields': ['biblio','essays', 'audiovisuals', 
            'lectures', 'maps'], 'classes': ['collapse']}),
        ('Weblinks',   {'fields': ['weblinks'], 'classes': ['collapse']}),
        ('Behind the scenes',   {'fields': ['ordinal', 
            'edit_date', 'status_num', 'edited_by', 'notes'], 'classes': ['collapse']}),
    ]
    inlines = [ SupplementInline]
    list_display = ('short_name', 'title', 'ordinal', 'status_num')
    filter_horizontal = ['gradelevels', 'subjects', 'profiles', 'artifacts', 'documents',
        'weblinks', 'biblio','essays', 'audiovisuals', 'lectures', 'maps']

admin.site.register(Lesson, LessonAdmin)
