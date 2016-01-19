from django.shortcuts import render_to_response, get_object_or_404
from django.conf import settings
from django.views import generic
from scholars.models import Lecture, Interview
from core.views import MenuInfoMixin


class LectureListView(MenuInfoMixin, generic.ListView):
    queryset = Lecture.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    context_object_name = 'resource_object_list'
    # template_name = 'scholars/lecture_list.html' 
    menu_type='lecture'


class InterviewListView(MenuInfoMixin, generic.ListView):
    queryset = Interview.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    context_object_name = 'resource_object_list'
    # template_name = 'scholars/interview_list.html' 
    menu_type='interview'


class LectureDetailView(MenuInfoMixin, generic.DetailView):
    model = Lecture
    slug_field = 'short_name'
    context_object_name = 'resource_object'
    # menu type for MenuMixin - to enable main nav highlight
    menu_type='lecture'
    # determine template_name 
    if settings.SITE_ID == 2:
        template_name = 'pq/scholars/lecture.html'
    else:
        template_name = 'scholars/lecture_detail.html'


def ideas(request, short_name):
    o = get_object_or_404(Lecture, short_name=short_name)
    idea_list = o.idea_set.all()
    title = o.title
    return render_to_response('connections/ideas.html', {'title': title, 'idea_list': idea_list})
    
def biblio(request, short_name):
    o = get_object_or_404(Lecture, short_name=short_name)
    source_list = o.biblio.filter(biblio_type="source")
    arts_list = o.biblio.filter(biblio_type="related_arts")
    item_title = o.title
    return render_to_response('connections/biblio.html', {'source_list': source_list, 
        'arts_list': arts_list, 'item_title': item_title})


def interview(request, short_name):
    o = get_object_or_404(Interview, short_name=short_name)
    curr_question = o.question_set.all()[:1].get()
    if settings.SITE_ID == 2:
        template_path = 'pq/scholars/interview.html'
    else:
        template_path = 'scholars/interview_detail.html'
    return render_to_response(template_path, {'resource_object': o, 'curr_question_num': 1, 
        'curr_question': curr_question, 'resource_type': 'interview',
        'main_nav_selected': 'museum_resources'})

def inter_view(request, short_name, question_num):
    """
    Supports Ajax call to replace current video
    The question_num can just pass on for the video name
    But we need the text of the question title
    For that matter, we can just pass through the interview short_name rather than the object
    """
    o = get_object_or_404(Interview, short_name=short_name)
    # retrieve question number
    q_int = int(question_num)
    if q_int == 0:
        curr_question = "full video, no question displayed."
    else:
        try:
            curr_question = o.question_set.all()[(q_int-1):q_int].get()
        except:
            raise Http404
    # different template for PQ as of MSE2.0
    if settings.SITE_ID == 2:
        template_path = 'pq/scholars/_inter_view.html'
    else:
        template_path = 'scholars/_inter_view.html'
    return render_to_response(template_path, {'resource_object': o, 
        'curr_question_num': question_num, 'curr_question': curr_question})

