from django.db import models
from django.contrib.sites.models import Site
import datetime
import sitewide.models
import core.models

class Lecture(core.models.ManyModel):
    _app_namespace = "scholars"
    _resource_type = "lecture"
    _resource_type_title = "Lecture"
    _static_path = "scholars/lectures"
    title = models.CharField(max_length=128)
    subtitle = models.CharField(max_length=128, blank=True, default='')
    scholar = models.CharField('Scholars full name',max_length=128, blank=True, default='')
    scholar_short_name = models.CharField(max_length=32, blank=True, default='')
    # Not included in ManyModel
    interviews = models.ManyToManyField('scholars.Interview', 
        verbose_name='Interviews related to this  Lecture', blank=True)
    # For MPMRC version
    sites = models.ManyToManyField(Site,
            help_text="All lectures appear in MSE -- only need to move Pequot " \
            "over here for those desired in Pequot<br>")

    # return title without <i> </i>
    @property
    def title_no_markup(self):
        return self.title.replace("<i>", "").replace("</i>", "").replace("<em>", 
            "").replace("</em>", "")

    # return filename = short name. to be compatible with Artifacts, Docs in search results
    @property
    def filename(self):
        return self.short_name

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='lecture')

    def __str__(self):
        return self.title

class Topic(models.Model):
    lecture = models.ForeignKey('scholars.Lecture')
    topic_num = models.IntegerField(default=0)
    title = models.CharField(max_length=128)
    transcript = models.TextField('Transcription', blank=True, default='')
    caption = models.TextField('Caption', blank=True, default='')

    class Meta:
        ordering = ['topic_num']

    def __str__(self):
        return self.title


class Idea(models.Model):
    lecture = models.ForeignKey('scholars.Lecture')
    name = models.CharField('Label', max_length=64, blank=True, default='')
    idea_text = models.TextField(blank=True, default='')
    idea_num = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Interview(core.models.CommonModel):
    _app_namespace = "scholars"
    _resource_type = "interview"
    _resource_type_title = "Interview"
    _static_path = "scholars/interviews"
    scholar = models.CharField('Scholars full name',max_length=128, blank=True, default='')
    scholar_short_name = models.CharField(max_length=32, blank=True, default='')
    full_length = models.CharField('Full video length', max_length=16, blank=True, default='')
    # profiles - enables: 1) showing content creator on Interview page
    # 2) listing this Interview on the person's Profile page
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)
    resourcesets = models.ManyToManyField('resources.Resourceset', 
        verbose_name='Choose Resource Sets this Interview belongs to', blank=True)
    sites = models.ManyToManyField(Site,
            help_text="All lectures appear in MSE -- only need to move Pequot " \
            "over here for those desired in Pequot<br>")

    # return filename = short name. to be compatible with Artifacts, Docs in search results
    @property
    def filename(self):
        return self.short_name

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='interview')

    # "alias" for scholar for use by featured item list
    @property
    def title(self):
        return self.scholar

    def __str__(self):
        return self.short_name

class Question(models.Model):
    interview = models.ForeignKey('scholars.Interview')
    title = models.CharField(max_length=128)
    question_text = models.CharField(max_length=255, blank=True, default='')
    question_num = models.IntegerField(default=0)
    length = models.CharField(max_length=16, blank=True, default='')

    class Meta:
        ordering = ['question_num']

    def __str__(self):
        return self.title


