from django.db import models
import datetime
import sitewide.models
import core.models

class Resourceset(core.models.CommonModel):
    _app_namespace = "resources"
    _resource_type = "resourceset"
    _resource_type_title = "Resource Set"
    _static_path = "resources"
    title = models.CharField(max_length=128)
    subtitle = models.CharField(max_length=128, blank=True, default='')
    # Manys
    # not artifacts
    audiovisuals = models.ManyToManyField('connections.Audiovisual', 
        verbose_name='Media (slimbox)', blank=True)
    biblio = models.ManyToManyField('connections.Biblio', 
        verbose_name='Further Study', blank=True)
    connections = models.ManyToManyField('connections.Connection', 
        verbose_name='PDFs', blank=True)
    # not docs
    essays = models.ManyToManyField('connections.Essay', 
        verbose_name='Background Info', blank=True)
    lectures = models.ManyToManyField('scholars.Lecture', 
        verbose_name='Lectures (full page)', blank=True)
    maps = models.ManyToManyField('maps.Geomap', 
        verbose_name='Maps (full page)', blank=True)
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)
    # not resource sets.
    weblinks = models.ManyToManyField('connections.Weblink', blank=True)
    lessons = models.ManyToManyField('curriculum.Lesson', 
        verbose_name='Lesson PDFs (new tab)', blank=True)

    # return title without <i> </i>
    @property
    def title_no_markup(self):
        return self.title.replace("<i>", "").replace("</i>", "")

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='resourceset')

    def __str__(self):
        return self.title

class Idea(models.Model):
    resourceset = models.ForeignKey('resources.Resourceset')
    name = models.CharField('Label', max_length=64, blank=True, default='')
    idea_text = models.TextField(blank=True, default='')
    idea_num = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
