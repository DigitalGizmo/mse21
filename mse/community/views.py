from django.views import generic

from django.shortcuts import render_to_response, get_object_or_404
from django.template import Context, loader
from django.http import Http404
from django.conf import settings
from community.models import Profile, Project
from artifacts.models import Artifact
from documents.models import Document
from maps.models import Geomap
from core.views import MenuInfoMixin


class ProfileListView(MenuInfoMixin, generic.ListView):
    """
    Shares template with Living Documents menu/list
    """
    queryset = Profile.objects.filter(
        status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    # paginate_by = 20
    context_object_name = 'resource_object_list'
    template_name = 'community/community_list.html' # this is default
    menu_type='community'

    # Get list of events as well
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(ProfileListView, self).get_context_data(**kwargs)
        # Add in a QuerySet of (filtered?) events
        context['project_list'] = Project.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
        return context
        

def index(request):
    item_list = Profile.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    project_list = Project.objects.filter(status_num__gte=settings.STATUS_LEVEL).order_by('ordinal')
    artifact_list = Artifact.objects.all().filter(augmented=True, 
        status_num__gte=settings.STATUS_LEVEL)
    document_list = Document.objects.all().filter(augmented=True, 
        status_num__gte=settings.STATUS_LEVEL)
    map_list = Geomap.objects.all().filter(augmented=True, 
        status_num__gte=settings.STATUS_LEVEL)
    return render_to_response('community/index.html', {'item_list': item_list, 
        'project_list': project_list, 'artifact_list': artifact_list, 
        'document_list': document_list, 'map_list': map_list})

def profile(request, short_name):
    o = get_object_or_404(Profile, short_name=short_name)
    # did have for artifact in resource_object.artifact_set.all in template
    # but now retrieved here in order to filter for status
    project_list = o.project_set.filter(status_num__gte=settings.STATUS_LEVEL)
    artifact_list = o.artifact_set.filter(status_num__gte=settings.STATUS_LEVEL)
    document_list = o.document_set.filter(status_num__gte=settings.STATUS_LEVEL)
    geomap_list = o.geomap_set.filter(status_num__gte=settings.STATUS_LEVEL)
    interview_list = o.interview_set.filter(status_num__gte=settings.STATUS_LEVEL)
    lesson_list = o.lesson_set.filter(status_num__gte=settings.STATUS_LEVEL)
    lesson_list = o.lesson_set.all()
    return render_to_response('community/profile_detail.html', {'resource_object': o, 
        'project_list': project_list, 'artifact_list': artifact_list, 
        'document_list': document_list, 'geomap_list': geomap_list, 
        'interview_list': interview_list, 'lesson_list': lesson_list,
        'main_nav_selected': 'about'})


class ProjectDetailView(MenuInfoMixin, generic.DetailView):
    model = Project
    slug_field = 'short_name'
    context_object_name = 'resource_object'
    template_name = 'community/project_detail.html'
    menu_type='project'


