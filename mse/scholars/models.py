from django.db import models
from django.contrib.sites.models import Site

import datetime

class Lecture(models.Model):
    STATUS_NUMS = (
        (1,'1 - Entered'),
        (2,'2 - TBD'),
        (3,'3 - Work in progress'),
        (4,'4 - Published'),
    )
    short_name = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=128)
    scholar = models.CharField('Scholars full name',max_length=128, blank=True, default='')
    scholar_short_name = models.CharField(max_length=32, blank=True, default='')
    narrative = models.TextField('About this...', blank=True, default='')
    notes = models.TextField('Production Notes', blank=True, default='')
    edited_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('edit date', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)
    ordinal = models.IntegerField('Order in Menu', default=999)
    resourcesets = models.ManyToManyField('resources.Resourceset', 
        verbose_name='Choose Resource Sets this Lecture belongs to', blank=True)
    artifacts = models.ManyToManyField('artifacts.Artifact', 
        verbose_name='Artifacts related to this Lecture', blank=True)
    documents = models.ManyToManyField('documents.Document', 
        verbose_name='Documents related to this Lecture', blank=True)
    connections = models.ManyToManyField('connections.Connection', 
        verbose_name='PDFs - Classroom only. (new tab)', blank=True)
    weblinks = models.ManyToManyField('connections.Weblink', blank=True)
    biblio = models.ManyToManyField('connections.Biblio', 
        verbose_name='Further Study', blank=True)
    essays = models.ManyToManyField('connections.Essay', 
        verbose_name='Background Info', blank=True)
    audiovisuals = models.ManyToManyField('connections.Audiovisual', 
        verbose_name='Media (slimbox)', blank=True)
    maps = models.ManyToManyField('maps.Geomap', 
        verbose_name='Maps (full page)', blank=True)
    lectures = models.ManyToManyField('scholars.Lecture', 
        verbose_name='Other Lectures related to this one', blank=True)
    interviews = models.ManyToManyField('scholars.Interview', 
        verbose_name='Interviews related to this  Lecture', blank=True)
    sites = models.ManyToManyField(Site,
            help_text="All lectures appear in MSE -- only need to move Pequot " \
            "over here for those desired in Pequot<br>")

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


class Interview(models.Model):
    STATUS_NUMS = (
        (1,'1 - Entered'),
        (2,'2 - TBD'),
        (3,'3 - Work in progress'),
        (4,'4 - Published'),
    )
    short_name = models.CharField(max_length=32, unique=True)
    scholar = models.CharField('Scholars full name',max_length=128, blank=True, default='')
    scholar_short_name = models.CharField(max_length=32, blank=True, default='')
    full_length = models.CharField('Full video length', max_length=16, blank=True, default='')
    narrative = models.TextField('About this...', blank=True, default='')
    ordinal = models.IntegerField('Order in Menu', default=999)
    notes = models.TextField('Production Notes', blank=True, default='')
    edited_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('edit date', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)
    # profiles - enables: 1) showing content creator on Interview page
    # 2) listing this Interview on the person's Profile page
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)
    resourcesets = models.ManyToManyField('resources.Resourceset', 
        verbose_name='Choose Resource Sets this Interview belongs to', blank=True)
    sites = models.ManyToManyField(Site,
            help_text="All lectures appear in MSE -- only need to move Pequot " \
            "over here for those desired in Pequot<br>")

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


