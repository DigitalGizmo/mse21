from django.db import models
import datetime
import sitewide.models
import core.models

class Profile(core.models.CommonModel):
    """
    Profile page will list Artfiacts, Docs etc. created by the Profilee. These are 
    established by the Profile many-to-many line in each project type model (Artifact, etc.)
    """
    _app_namespace = "community"
    _resource_type = "profile"
    profile_name = models.CharField(max_length=128)
    institution = models.CharField(max_length=128, blank=True, default='')
    location = models.CharField(max_length=128, blank=True, default='')
    is_institution = models.BooleanField()

    # return app_namespace
    @property
    def app_namespace(self):
        return Profile._app_namespace

    # return resource_type
    @property
    def resource_type(self):
        return Profile._resource_type

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='profile')

    # "alias" for profile_name for use by featured item list
    @property
    def title(self):
        return self.profile_name

    def __str__(self):
        return self.profile_name
        
# a.k.a. Classroom Project (Artifacts, Docs etc. are also "projects")
class Project(core.models.ManyModel):
    _app_namespace = "community"
    _resource_type = "project"
    title = models.CharField(max_length=128)
    subtitle = models.CharField(max_length=128, blank=True, default='')
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)

    # return app_namespace
    @property
    def app_namespace(self):
        return Project._app_namespace

    # return resource_type
    @property
    def resource_type(self):
        return Project._resource_type

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='project')

    class Meta:
         verbose_name = "Classroom Project"

    def __str__(self):
        return self.title
