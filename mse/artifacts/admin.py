from artifacts.models import Artifact, Question, Page, Idea
from artifacts.forms import QuestionForm

from django.contrib import admin

class QuestionInline(admin.TabularInline):
    model = Question
    form = QuestionForm
    extra = 3

class PageInline(admin.TabularInline):
    model = Page
    extra = 2

class IdeaInline(admin.TabularInline):
    model = Idea
    extra = 2

class ArtifactAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,            {'fields': ['title', 'filename', 'short_name','id_number', 'object_name', 'date_made', 'maker', 'materials', 'measurements', 'assoc_place', 'description', 'narrative']}),
        ('Content Creator(s)',   {'fields': ['profiles'], 'classes': ['collapse']}),
        ('Resource Sets',   {'fields': ['resourcesets'], 'classes': ['collapse']}),
        ('Related Items from Collection',   {'fields': ['artifacts', 'documents'], 'classes': ['collapse']}),
        ('Related Resources',   {'fields': ['biblio','essays', 'audiovisuals', 'lectures', 'maps'], 'classes': ['collapse']}),
        ('Related Resources or Classroom',   {'fields': ['connections'], 'classes': ['collapse']}),
        ('Weblinks',   {'fields': ['weblinks'], 'classes': ['collapse']}),
        ('Behind the scenes',   {'fields': ['is_vertical', 'augmented', 'ordinal', 'edit_date', 'status_num', 'edited_by', 'notes'], 'classes': ['collapse']}),
    ]
    inlines = [QuestionInline, IdeaInline, PageInline]
    list_display = ('title', 'id_number', 'filename', 'short_name', 'status_num', 'description')
    list_filter	 = ['augmented'] # , 'edit_date'
    search_fields = ['id_number', 'title', 'short_name']
    filter_horizontal = ['resourcesets', 'artifacts', 'documents', 'connections','weblinks','biblio', 'essays', 'audiovisuals', 'lectures', 'maps', 'profiles']

admin.site.register(Artifact, ArtifactAdmin)

