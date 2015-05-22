from django.db import models

import datetime

class Resourceset(models.Model):
    STATUS_NUMS = (
        (1,'1 - Entered'),
        (2,'2 - TBD'),
        (3,'3 - Work in progress'),
        (4,'4 - Published'),
    )
    short_name = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=128)
    narrative = models.TextField('Narrative', blank=True, default='')
    notes = models.TextField('Production Notes', blank=True, default='')
    edited_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('edit date', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)
    ordinal = models.IntegerField('Order in Menu', default=999)
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)
    connections = models.ManyToManyField('connections.Connection', 
        verbose_name='PDFs', blank=True)
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
        verbose_name='Lectures (full page)', blank=True)

    def __str__(self):
        return self.title

class Idea(models.Model):
    resourceset = models.ForeignKey('resources.Resourceset')
    name = models.CharField('Label', max_length=64, blank=True, default='')
    idea_text = models.TextField(blank=True, default='')
    idea_num = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
