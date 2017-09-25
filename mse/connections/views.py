from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
from connections.models import Essay, Biblio, Moreinfo, Audiovisual, Slide

def essay(request, short_name_param):
    e = get_object_or_404(Essay, short_name=short_name_param)
    return render_to_response('connections/essay.html', {'essay': e, 'siteid': settings.SITE_ID})

def moreinfo(request, short_name_param):
    o = get_object_or_404(Moreinfo, short_name=short_name_param)
    return render_to_response('connections/moreinfo.html', {'connection_object': o})

# image, audio and video media_type s combined here
def audiovisual(request, short_name_param):
    o = get_object_or_404(Audiovisual, short_name=short_name_param)
    return render_to_response('connections/audiovisual.html', {'connection_object': o})
        
# initial slide or replace whole slim box (ajax_wrapper) for each slide
def slides(request, short_name_param, slide_num=1):
    """
	Supports Ajax call to replace current slide
	"""
    o = get_object_or_404(Audiovisual, short_name=short_name_param) 
    sn_int = int(slide_num)
    # get the record for this slide

    slide = get_object_or_404(Slide, audiovisual_id=o.id, 
        slide_num=slide_num)

    return render_to_response('connections/slide.html', {'connection_object': o, 
        'slide': slide})

# for attract loop (not really a connection)
def loop(request, slide_num):
    return render_to_response('pq/connections/attractloop.html', {'slide_num': slide_num})


