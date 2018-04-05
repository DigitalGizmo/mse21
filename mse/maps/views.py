from django.shortcuts import render, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
import json
from django.core import serializers
from django.contrib.sites.models import Site
from maps.models import Geomap
from scholars.models import Lecture, Interview
from sitewide.models import Menu


def index(request):
    """
    Unlike the other menus which draw directly on tables, this one is filtered via the
    maps_geomaps_sites association table.
    Leaving this as a Function Based View -- not converting from legacy because 
    it's complicated!
    """
    # handle multiple sites. Use raw ID which will work on devel as well as public
    item_list = Geomap.objects.filter(map_type='Voyage', 
        status_num__gte=settings.STATUS_LEVEL, 
        sites__id__exact=settings.SITE_ID).order_by('ordinal')
        # , sites__id=settings.SITE_ID
    story_list = Geomap.objects.filter(map_type='Story', 
        status_num__gte=settings.STATUS_LEVEL, 
        sites__id__exact=settings.SITE_ID).order_by('ordinal')    
    # handle multiple sites. Use raw ID which will work on devel as well as public
    # this map menu is the main menu for Pequot
    if settings.SITE_ID == 2:
        lecture_list = Lecture.objects.filter(status_num__gte=settings.STATUS_LEVEL, 
            sites__id__exact=settings.SITE_ID).order_by('ordinal')
        interview_list = Interview.objects.filter(status_num__gte=settings.STATUS_LEVEL, 
            sites__id__exact=settings.SITE_ID).order_by('ordinal')
        return render(request, 'pq/maps/index.html', {'item_list': item_list, 
            'story_list': story_list, 'lecture_list': lecture_list, 
            'interview_list': interview_list})
    else: # regular MSE menu
        menu_info = get_object_or_404(Menu, short_name='geomap')
        return render(request, 'maps/map_list.html', {'resource_object_list': item_list, 
            'story_list': story_list, 'menu_info': menu_info, 
            'main_nav_selected': menu_info.main_nav_name})

def detail(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    # handle multiple sites. Use raw ID which will work on devel as well as public
    if settings.SITE_ID == 2:
        template_path = 'pq/maps/detail.html'
    else:
        template_path = 'maps/map_detail.html'
    return render(request, template_path, {'resource_object': o, 
        'main_nav_selected': 'museum_resources'})

def voyage(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    if settings.SITE_ID == 2:
        #lectures = o.lectures.all()  
        return render(request, 'pq/maps/voyage.html', {'resource_object': o})
    else:
        return render(request, 'maps/voyage.html', {'resource_object': o,
            'main_nav_selected': 'museum_resources'})


def story(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    #chap_list = o.chapter_set.all()
    chap_list = serializers.serialize("json", o.chapter_set.all())
    # pq version gets sidebar connections
    if settings.SITE_ID == 2:
        return render(request, 'pq/maps/story.html', {'resource_object': o, 
            'chap_data': chap_list})
    else:
        return render(request, 'maps/story.html', {'resource_object': o, 
            'chap_data': chap_list, 'main_nav_selected': 'museum_resources'})


# @param - short_name -- this must be "compare" in order to access the special geomap
# the compare geomap (only) has a child list of voyages to compare
# this supplies the list of geomap_ids to HTML and thence to JS.
def compare(request, short_name):
    the_compare_geomap = get_object_or_404(Geomap, short_name=short_name)
    if settings.SITE_ID == 2:
        template_path = 'pq/maps/compare.html'
        voyage_list = get_voyage_list(the_compare_geomap)
    else:
        template_path = 'maps/compare.html'
        voyage_list = get_voyage_list(the_compare_geomap)

    # startLayerIndex of -2 means we're not automatically starting a voyage layer
    return render(request, template_path, {'resource_object': the_compare_geomap, 
        'start_layer_index': -2,
        'voyage_list': voyage_list, 'main_nav_selected': 'museum_resources'})


# @param - short_name -- this must be "compare" in order to access the special geomap
# -1 means we tried compare, but didn't find one
# -3 means an invalid number param was sent
# -2, for what it's worth, above, means we didn't come to comapre from a voyage.

# def compare_this(request, short_name, map_id, voyageid):
def compare_this(request, short_name, voyageid):
    # get the compare record
    the_compare_geomap = get_object_or_404(Geomap, short_name=short_name)
    # find the index for this id in the compare list
    voyage_list = get_voyage_list(the_compare_geomap)


    # # the map_id passed is apparently a string, so convert to int
    # try:
    #     m_id = int(map_id)
    # except ValueError:
    #     m_id = -3
    # map_index = -1
    # for idx, entry in enumerate(voyage_list):
    #     if entry['compare_map_id'] == m_id:
    #         map_index = idx

    # Generate the layer index for this initial (starting) map.
    # The order of the voyage list here is the same as the order
    # that appears on the html interface-- since that's generated by this same list
    # Set default, in case there is no match.
    start_layer_index = -1;
    for idx, entry in enumerate(voyage_list):
        if entry['compare_voyage_id'] == voyageid:
            start_layer_index = idx

    if settings.SITE_ID == 2:
        template_path = 'pq/maps/compare.html'
    else:
        template_path = 'maps/compare.html'
    return render(request, template_path, {'resource_object': the_compare_geomap, 
        'voyage_list': voyage_list, 'start_layer_index': start_layer_index,
        'voyageid': voyageid, 'main_nav_selected': 'museum_resources'})

# compare object, map id (-1 for none)
#sites__id__exact=settings.SITE_ID
def get_voyage_list(the_compare_geomap):
    # prep list of voyages. Use pk to get map titles
    voyage_list = []
    # using the ids in the compare set, get each geomap to compare
    for compare_entry in the_compare_geomap.comparevoyage_set.all():
        voyage_to_compare = Geomap.objects.get(pk=compare_entry.compare_geomap_id)
        #if (settings.SITE_ID == vo.sites__id__exact):
        #if (vo.sites__id == settings.SITE_ID):
        #a = Article.objects.get(id=article_id, sites__id=get_current_site(request).id)  
        #if (sites_list[0] == settings.SITE_ID):
        # -------
        # need to list only maps for current site ID
        # this is the long way around, must be a shortcut
        #sites_list = vo.sites.all()
        belongs = False
        for s in voyage_to_compare.sites.all():
            if (s.id == settings.SITE_ID):
                belongs = True       
        if (belongs):
        # how do I filter per current site?
            voyage_list.append({'compare_voyage_id': compare_entry.compare_voyage_id, 
                'color': compare_entry.color, 'title': voyage_to_compare.title, 
                'short_name': voyage_to_compare.short_name, 
                'date_range': voyage_to_compare.date_range, 
                'description': voyage_to_compare.description})
    return voyage_list

def about(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    return render(request, 'maps/about.html', {'resource_object': o, 
        'siteid': settings.SITE_ID})

def storyprint(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    return render(request, 'maps/storyprint.html', {'resource_object': o, 
        'siteid': settings.SITE_ID})

def storylarge(request, short_name, chap_num):
    o = get_object_or_404(Geomap, short_name=short_name)
    return render(request, 'maps/storylarge.html', {'resource_object': o, 
        'chap_num': chap_num, 'siteid': settings.SITE_ID})

def journal_page(request, short_name, page_num):
    o = get_object_or_404(Geomap, short_name=short_name)
    return render(request, 'maps/journal_page.html', {'resource_object': o, 
        'page_num': page_num, 'siteid': settings.SITE_ID})

def ideas(request, short_name):
    #print "short name: " + short_name
    o = get_object_or_404(Geomap, short_name=short_name)
    idea_list = o.idea_set.all()
    title = o.title
    return render(request, 'connections/ideas.html', {'title': title,
        'idea_list': idea_list, 'siteid': settings.SITE_ID})

def biblio(request, short_name):
    o = get_object_or_404(Geomap, short_name=short_name)
    source_list = o.biblio.filter(biblio_type="source")
    arts_list = o.biblio.filter(biblio_type="related_arts")
    item_title = o.title
    return render(request, 'connections/biblio.html', {'source_list': source_list, 
        'arts_list': arts_list, 'item_title': item_title, 'siteid': settings.SITE_ID})
