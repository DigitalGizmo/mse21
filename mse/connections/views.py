from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
from connections.models import Essay, Biblio, Moreinfo, Audiovisual

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
    try:
        curr_slide = o.slide_set.all()[(sn_int-1):sn_int].get()
        num_slides = len(o.slide_set.all())
    except:
        raise Http404   
    return render_to_response('connections/slide.html', {'connection_object': o, 'slide_num': sn_int, 'curr_slide': curr_slide, 'num_slides': num_slides})

# for attract loop (not really a connection)
def loop(request, slide_num):
    return render_to_response('pq/connections/attractloop.html', {'slide_num': slide_num})


