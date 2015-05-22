from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
from scholars.models import Lecture, Interview

def index(request):
    item_list = Lecture.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    interview_list = Interview.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    return render_to_response('scholars/index.html', {'item_list': item_list, 'interview_list': interview_list})

def lecture(request, short_name):
    o = get_object_or_404(Lecture, short_name=short_name)
    related_artifacts = o.artifacts.filter(status_num__gte=settings.STATUS_LEVEL) 
    related_docs = o.documents.filter(status_num__gte=settings.STATUS_LEVEL) 
    related_pdfs = o.connections.filter(link_heading='related')  
    classroom_pdfs = o.connections.filter(link_heading='classroom')  
    essays = o.essays.all()  
    audiovisuals = o.audiovisuals.all()  
    maps = o.maps.all()  
    lectures = o.lectures.all()  
    interviews = o.interviews.all()  
    # determine whether to show further reading link
    if o.biblio.all():
        has_further = True
    else:
        has_further = False
    if settings.SITE_ID == 2:
        template_path = 'pq/scholars/lecture.html'
    else:
        template_path = 'scholars/lecture.html'
    return render_to_response(template_path, {'resource_object': o, 'resource_type': 'scholars/lecture', 'related_artifacts': related_artifacts, 'related_docs': related_docs, 'classroom_pdfs': classroom_pdfs, 'related_pdfs': related_pdfs, 'essays': essays, 'audiovisuals': audiovisuals, 'maps': maps, 'lectures': lectures, 'interviews': interviews, 'has_further': has_further, 'has_items': True})

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
    return render_to_response('connections/biblio.html', {'source_list': source_list, 'arts_list': arts_list, 'item_title': item_title})


def interview(request, short_name):
    o = get_object_or_404(Interview, short_name=short_name)
    curr_question = o.question_set.all()[:1].get()
    if settings.SITE_ID == 2:
        template_path = 'pq/scholars/interview.html'
    else:
        template_path = 'scholars/interview.html'
    return render_to_response(template_path, {'resource_object': o, 'curr_question_num': 1, 'curr_question': curr_question, 'resource_type': 'scholars/interview'})

def inter_view(request, short_name, question_num):
    """
    Supports Ajax call to replace current video
    The question_num can just pass on for the video name
    But we need the text of the question title
    For that matter, we can just pass through the interview short_name rather than the object
    """
    o = get_object_or_404(Interview, short_name=short_name)
    q_int = int(question_num)
    if q_int == 0:
        curr_question = "full video, no question displayed."
    else:
        try:
            curr_question = o.question_set.all()[(q_int-1):q_int].get()
        except:
            raise Http404
    return render_to_response('scholars/inter_view.html', {'resource_object': o, 'curr_question_num': question_num, 'curr_question': curr_question})

