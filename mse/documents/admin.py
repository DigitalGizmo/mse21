from documents.models import Document, Question, Page, Idea
#from connections.models import Connection

from django.contrib import admin

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 3

class PageInline(admin.TabularInline):
    model = Page
    extra = 2

class IdeaInline(admin.TabularInline):
    model = Idea
    extra = 2

class DocumentAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,            {'fields': ['title', 'subtitle', 'short_name','filename',  'bibid', 
            'identifier', 'object_name', 'date_made', 'author', 'initial_zoom', 'initial_x', 
            'initial_y', 'description', 'narrative', 'hist_context']}),
        ('Content Creator(s)',   {'fields': ['profiles', 'read_by'], 'classes': ['collapse']}),
        ('Resource Sets',   {'fields': ['resourcesets'], 'classes': ['collapse']}),
        ('Related Items from Collection',   {'fields': ['artifacts', 'documents'], 
            'classes': ['collapse']}),
        ('Related Resources',   {'fields': ['biblio','essays', 'audiovisuals', 'lectures', 
            'maps', 'videos'], 'classes': ['collapse']}),
        ('Related Lesson, other PDFs',   {'fields': ['connections', 'lessons'], 'classes': 
            ['collapse']}),
        ('Weblinks',   {'fields': ['weblinks'], 'classes': ['collapse']}),
        ('Behind the scenes',   {'fields': ['augmented', 'ordinal', 'edit_date', 'status_num', 
            'edited_by', 'notes'], 'classes': ['collapse']}),
    ]
    inlines = [QuestionInline, IdeaInline, PageInline]
    list_display = ('title', 'short_name', 'filename', 'identifier', 'bibid', 'status_num', 
        'description') # 'filename', 
    list_filter	 = ['augmented']
    search_fields = ['identifier', 'title', 'short_name']
    filter_horizontal = ['resourcesets','artifacts', 'documents', 'connections','weblinks',
        'biblio', 'essays', 'audiovisuals', 'lectures', 'maps','profiles', 'lessons', 'videos']

admin.site.register(Document, DocumentAdmin)


