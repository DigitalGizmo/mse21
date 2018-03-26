from scholars.models import Lecture, Topic, Idea, Interview, Question

from django.contrib import admin

class TopicInline(admin.TabularInline):
    model = Topic
    extra = 2

class IdeaInline(admin.TabularInline):
    model = Idea
    extra = 2

class LectureAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,            {'fields': ['title', 'subtitle', 'short_name', 'scholar', 
            'scholar_short_name', 'narrative', 'sites']}),
        ('Resource Sets',   {'fields': ['resourcesets'], 'classes': ['collapse']}),
        ('Related Items from Collection',   {'fields': ['artifacts', 'documents'], 
            'classes': ['collapse']}),
        ('Related Resources',   {'fields': ['biblio','essays', 'audiovisuals', 
            'lectures', 'interviews', 'maps', 'videos'], 'classes': ['collapse']}),
        ('Related Lesson, other PDFs',   {'fields': ['connections', 'lessons'], 'classes': 
            ['collapse']}),
        ('Weblinks',   {'fields': ['weblinks'], 'classes': ['collapse']}),
        ('Behind the scenes',   {'fields': ['ordinal', 'edit_date', 'status_num', 
            'edited_by', 'notes'], 'classes': ['collapse']}),
    ]
    inlines = [TopicInline, IdeaInline]
    list_display = ('title', 'short_name', 'status_num', 'scholar')
    list_filter	 = ['scholar_short_name']
    filter_horizontal = ['resourcesets', 'artifacts', 'documents', 'connections', 
        'weblinks', 'biblio', 'essays', 'audiovisuals', 'lectures', 'interviews', 
        'maps', 'sites', 'lessons', 'videos']
admin.site.register(Lecture, LectureAdmin)


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 3

class InterviewAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,            {'fields': ['short_name', 'scholar', 'scholar_short_name', 
            'full_length', 'narrative', 'sites']}),
        ('Content Creator(s)',   {'fields': ['profiles'], 'classes': ['collapse']}),
        ('Resource Sets',   {'fields': ['resourcesets'], 'classes': ['collapse']}),
        ('Behind the scenes',   {'fields': ['ordinal', 'edit_date', 'status_num', 
            'edited_by', 'notes'], 'classes': ['collapse']}),
    ]
    inlines = [QuestionInline]
    list_display = ('short_name', 'scholar', 'status_num')
    list_filter	 = ['scholar_short_name']
    filter_horizontal = ['resourcesets', 'profiles', 'sites']

admin.site.register(Interview, InterviewAdmin)

