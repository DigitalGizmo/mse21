from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.views.generic.edit import FormMixin
from django.db.models import Q
from operator import __or__ as OR
import functools
from django.conf import settings
from core.views import MenuInfoMixin
from .models import Lesson, Gradelevel, Subject
from .forms import LessonSearchForm


class LessonDetailView(MenuInfoMixin, generic.DetailView):
    model = Lesson
    slug_field = 'short_name'
    context_object_name = 'resource_object'
    # template_name = 'curriculum/lesson_detail.html' # default
    menu_type='lesson'


class LessonListView(MenuInfoMixin, FormMixin, generic.ListView):
    """
    Patterned after sitewide SearchListView which..
    follows http://schinckel.net/2014/08/17/leveraging-html-and-django-
                    forms%3A-pagination-of-filtered-results/
    """
    queryset = Lesson.objects.filter( 
        status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    form_class = LessonSearchForm
    context_object_name = 'resource_object_list'
    # template_name = 'curriculum/lesson_list.html' # default
    menu_type='lesson'
    # specific to methods below
    # init_data = {'gls': Gradelevel.objects.all().values_list('short_name', flat=True),
        # 'sjs': Subject.objects.all().values_list('short_name', flat=True)}
    # provide blank so that placeholder attr will appear, rather than "None"
    init_data = {'q': ''}

    def get_form_kwargs(self):
        return {
            'initial': self.get_initial(), # won't be using this
            'prefix': self.get_prefix(),  # don't know what this is
            'data': self.request.GET or self.init_data # None  # will add my data here
        }
    
    def get(self, request, *args, **kwargs):
        # get starting query set -- hopefully won't need this
        self.object_list = self.get_queryset()
        # get the form
        form = self.get_form(self.get_form_class())

        if form.is_valid():
            q = form.cleaned_data['q']

            # get lists of grade levels (gls) and subjects (sjs) checked
            gl_list = form.cleaned_data['gls']
            sj_list = form.cleaned_data['sjs']

            if q:
                self.object_list = self.object_list.filter(Q(title__icontains=q) | 
                    Q(subtitle__icontains=q) | Q(narrative__icontains=q ))

            # Grade Levels -- skip filter if they're all checked

            if len(gl_list) > 0 : # < len(self.init_data['gls'])
                # per undocumented .add method for Q objects
                # https://bradmontgomery.net/blog/adding-q-objects-in-django/
                qquery = Q(gradelevels__short_name=gl_list[0])

                for gradelevel in gl_list[1:]:
                    qquery.add((Q(gradelevels__short_name=gradelevel)), 'OR' ) # , qquery.connector

                self.object_list = self.object_list.filter(qquery)

                # alt, cryptic method
                # q_list = [Q(gradelevels__short_name='9_12'), 
                #    Q(gradelevels__short_name='6_8')]
                #self.object_list = self.object_list.filter(functools.reduce(OR, q_list))

                # either ends up creating something like:
                #self.object_list = self.object_list.filter(Q(gradelevels__short_name='3_5') | 
                #    Q(gradelevels__short_name='6_8'))

            if len(sj_list) > 0 : 
                qquery = Q(subjects__short_name=sj_list[0])

                for subject in sj_list[1:]:
                    qquery.add((Q(subjects__short_name=subject)), 'OR' ) 

                self.object_list = self.object_list.filter(qquery)

            # distinct ?

        context = self.get_context_data(form=form)
        context['result_count'] = len(self.object_list)
        return self.render_to_response(context)

def biblio(request, short_name):
    o = get_object_or_404(Lesson, short_name=short_name)
    source_list = o.biblio.filter(biblio_type="source")
    arts_list = o.biblio.filter(biblio_type="related_arts")
    item_title = o.title
    return render(request, 'connections/biblio.html', {'source_list': source_list, 
        'arts_list': arts_list, 'item_title': item_title})


