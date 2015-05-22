from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
#from django.utils import simplejson
import json
# from django.contrib.sites.models import Site
from maps.models import Geomap
from scholars.models import Lecture, Interview

from django.core import serializers

def index(request):
    # handle multiple sites. Use raw ID which will work on devel as well as public
    item_list = Geomap.objects.filter(map_type='Voyage', status_num__gte=settings.STATUS_LEVEL, sites__id__exact=settings.SITE_ID).order_by('ordinal')
    story_list = Geomap.objects.filter(map_type='Story', status_num__gte=settings.STATUS_LEVEL, sites__id__exact=settings.SITE_ID).order_by('ordinal')    
    # handle multiple sites. Use raw ID which will work on devel as well as public
    # this map menu is the main menu for Pequot
    if settings.SITE_ID == 2:
        lecture_list = Lecture.objects.filter(status_num__gte=settings.STATUS_LEVEL, sites__id__exact=settings.SITE_ID).order_by('ordinal')
        interview_list = Interview.objects.filter(status_num__gte=settings.STATUS_LEVEL, sites__id__exact=settings.SITE_ID).order_by('ordinal')
        return render_to_response('pq/maps/index.html', {'item_list': item_list, 'story_list': story_list, 'lecture_list': lecture_list, 'interview_list': interview_list})
    else:
        return render_to_response('maps/index.html', {'item_list': item_list, 'story_list': story_list})

def detail(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    related_artifacts = o.artifacts.filter(status_num__gte=settings.STATUS_LEVEL) 
    related_docs = o.documents.filter(status_num__gte=settings.STATUS_LEVEL) 
    related_pdfs = o.connections.filter(link_heading='related')  
    classroom_pdfs = o.connections.filter(link_heading='classroom')  
    essays = o.essays.all()  
    audiovisuals = o.audiovisuals.all()  
    maps = o.maps.all()  
    lectures = o.lectures.all()  
    # determine whether to show further reading link
    if o.biblio.all():
        has_further = True
    else:
        has_further = False
    # handle multiple sites. Use raw ID which will work on devel as well as public
    if settings.SITE_ID == 2:
        template_path = 'pq/maps/detail.html'
    else:
        template_path = 'maps/detail.html'
    return render_to_response(template_path, {'resource_object': o, 'related_artifacts': related_artifacts, 'related_docs': related_docs, 'classroom_pdfs': classroom_pdfs, 'related_pdfs': related_pdfs, 'essays': essays, 'audiovisuals': audiovisuals, 'maps': maps, 'lectures': lectures, 'resource_type': 'map', 'has_further': has_further, 'has_items': True})

def voyage(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    if settings.SITE_ID == 2:
        related_artifacts = o.artifacts.filter(status_num__gte=settings.STATUS_LEVEL) 
        related_docs = o.documents.filter(status_num__gte=settings.STATUS_LEVEL) 
        essays = o.essays.all()  
        audiovisuals = o.audiovisuals.all()  
        maps = o.maps.all()  
        lectures = o.lectures.all()  
        return render_to_response('pq/maps/voyage.html', {'resource_object': o, 'related_artifacts': related_artifacts, 'related_docs': related_docs, 'essays': essays, 'audiovisuals': audiovisuals, 'maps': maps, 'lectures': lectures, 'has_items': True})
    else:
        return render_to_response('maps/voyage.html', {'resource_object': o})

def story(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    #chap_list = o.chapter_set.all()
    chap_list = serializers.serialize("json", o.chapter_set.all())
    # pq version gets sidebar connections
    if settings.SITE_ID == 2:
        related_artifacts = o.artifacts.filter(status_num__gte=settings.STATUS_LEVEL) 
        related_docs = o.documents.filter(status_num__gte=settings.STATUS_LEVEL) 
        essays = o.essays.all()  
        audiovisuals = o.audiovisuals.all()  
        maps = o.maps.all()  
        lectures = o.lectures.all()  
        return render_to_response('pq/maps/story.html', {'resource_object': o, 'chap_data': chap_list, 'related_artifacts': related_artifacts, 'related_docs': related_docs, 'essays': essays, 'audiovisuals': audiovisuals, 'maps': maps, 'lectures': lectures, 'has_items': True})
    else:
        return render_to_response('maps/story.html', {'resource_object': o, 'chap_data': chap_list})
    # , "chap_data": chap_json

# map index of -2 sent to be compatible with compare_this (-1 sent when match tried but not found)
def compare(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    if settings.SITE_ID == 2:
        template_path = 'pq/maps/compare.html'
        voyage_list = get_voyage_list(o)
    else:
        template_path = 'maps/compare.html'
        voyage_list = get_voyage_list(o)
    return render_to_response(template_path, {'resource_object': o, 'voyage_list': voyage_list, 'map_index': -2})

# -1 means we tried compare, but didn't find one
# -3 means an invalid number param was sent
# -2, for what it's worth, above, means we didn't come to comapre from a voyage.
def compare_this(request, short_name, map_id):
    # get the compare record
    o = get_object_or_404(Geomap, short_name=short_name)
    # find the index for this id in the compare list
    voyage_list = get_voyage_list(o)
    # the map_id passed is apparently a string, so convert to int
    try:
        m_id = int(map_id)
    except ValueError:
        m_id = -3
    map_index = -1
    for idx, entry in enumerate(voyage_list):
        if entry['voyageID'] == m_id:
            map_index = idx
    if settings.SITE_ID == 2:
        template_path = 'pq/maps/compare.html'
    else:
        template_path = 'maps/compare.html'
    return render_to_response(template_path, {'resource_object': o, 'voyage_list': voyage_list, 'map_index': map_index})

# compare object, map id (-1 for none)
#sites__id__exact=settings.SITE_ID
def get_voyage_list(o):
    # prep list of voyages. Use pk to get map titles
    voyage_list = []
    for voyage in o.comparevoyage_set.all():
        vo = Geomap.objects.get(pk=voyage.voyageID)
        #if (settings.SITE_ID == vo.sites__id__exact):
        #if (vo.sites__id == settings.SITE_ID):
        #a = Article.objects.get(id=article_id, sites__id=get_current_site(request).id)  
        #if (sites_list[0] == settings.SITE_ID):
        # -------
        # need to list only maps for current site ID
        # this is the long way around, must be a shortcut
        #sites_list = vo.sites.all()
        belongs = False
        for s in vo.sites.all():
            if (s.id == settings.SITE_ID):
                belongs = True       
        if (belongs):
        # how do I filter per current site?
            voyage_list.append({'voyageID': voyage.voyageID, 'color': voyage.color, 'title': vo.title, 'short_name': vo.short_name, 'date_range': vo.date_range, 'description': vo.description})
    return voyage_list

def about(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    return render_to_response('maps/about.html', {'resource_object': o, 'siteid': settings.SITE_ID})

def storyprint(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    return render_to_response('maps/storyprint.html', {'resource_object': o, 'siteid': settings.SITE_ID})

def storylarge(request, short_name, chap_num):
    o = get_object_or_404(Geomap, short_name=short_name)
    return render_to_response('maps/storylarge.html', {'resource_object': o, 'chap_num': chap_num, 'siteid': settings.SITE_ID})

def journal_page(request, short_name, page_num):
    o = get_object_or_404(Geomap, short_name=short_name)
    return render_to_response('maps/journal_page.html', {'resource_object': o, 'page_num': page_num, 'siteid': settings.SITE_ID})

def ideas(request, short_name):
    #print "short name: " + short_name
    o = get_object_or_404(Geomap, short_name=short_name)
    idea_list = o.idea_set.all()
    title = o.title
    return render_to_response('connections/ideas.html', {'title': title,'idea_list': idea_list, 'siteid': settings.SITE_ID})

def biblio(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    source_list = o.biblio.filter(biblio_type="source")
    arts_list = o.biblio.filter(biblio_type="related_arts")
    item_title = o.title
    return render_to_response('connections/biblio.html', {'source_list': source_list, 'arts_list': arts_list, 'item_title': item_title, 'siteid': settings.SITE_ID})
