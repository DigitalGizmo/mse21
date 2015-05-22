from resources.models import Resourceset, Idea

from django.contrib import admin

class IdeaInline(admin.TabularInline):
    model = Idea
    extra = 2

class ResourcesetAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,                  {'fields': ['title', 'short_name', 'narrative']}),
        ('Content Creator(s)',   {'fields': ['profiles'], 'classes': ['collapse']}),
        ('Related Resources',   {'fields': ['biblio','essays', 'audiovisuals', 'lectures', 'maps'], 'classes': ['collapse']}),
        ('Related Resources or Classroom',   {'fields': ['connections'], 'classes': ['collapse']}),
        ('Weblinks',   {'fields': ['weblinks'], 'classes': ['collapse']}),
        ('Behind the scenes',   {'fields': ['ordinal', 'edit_date', 'status_num', 'edited_by', 'notes'], 'classes': ['collapse']}),
    ]
    inlines = [IdeaInline]
    list_display = ('title', 'short_name', 'status_num', 'edit_date')
    filter_horizontal = ['connections','weblinks','biblio', 'essays', 'audiovisuals', 'lectures', 'maps', 'profiles']
    search_fields = ['title', 'short_name']

admin.site.register(Resourceset, ResourcesetAdmin)

