from django.db import models

import datetime
# Profile page will list Artfiacts, Docs etc. created by the Profilee. These are 
# established by the Profile many-to-many line in each project type model (Artifact, etc.)
class Profile(models.Model):
    STATUS_NUMS = (
        (1,'1 - Entered'),
        (2,'2 - TBD'),
        (3,'3 - Work in progress'),
        (4,'4 - Published'),
    )
    short_name = models.CharField(max_length=32, unique=True)
    profile_name = models.CharField(max_length=128)
    institution = models.CharField(max_length=128, blank=True, default='')
    location = models.CharField(max_length=128, blank=True, default='')
    narrative = models.TextField('Narrative', blank=True, default='')
    is_institution = models.BooleanField()
    ordinal = models.IntegerField('Order in Menu', default=999)
    notes = models.TextField('Production Notes', blank=True, default='')
    edited_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('edit date', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)

    #class Meta:
    #     verbose_name = "map"
    
    def __str__(self):
        return self.profile_name
        
# a.k.a. Classroom Project (Artifacts, Docs etc. are also "projects")
class Project(models.Model):
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
    ordinal = models.IntegerField('Order in Menu', default=999)
    edited_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('edit date', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)
    resourcesets = models.ManyToManyField('resources.Resourceset', 
        verbose_name='Choose Resource Sets this Project belongs to', blank=True)
    artifacts = models.ManyToManyField('artifacts.Artifact', 
        verbose_name='Artifacts related to this Project', blank=True)
    documents = models.ManyToManyField('documents.Document', 
        verbose_name='Documents related to this Project', blank=True)
    connections = models.ManyToManyField('connections.Connection', 
        verbose_name='PDFs (new tab)', blank=True)
    weblinks = models.ManyToManyField('connections.Weblink', blank=True)
    biblio = models.ManyToManyField('connections.Biblio', 
        verbose_name='Further Study (slimbox)', blank=True)
    essays = models.ManyToManyField('connections.Essay', 
        verbose_name='Background Info (slimbox)', blank=True)
    audiovisuals = models.ManyToManyField('connections.Audiovisual', 
        verbose_name='Media (slimbox)', blank=True)
    maps = models.ManyToManyField('maps.Geomap', 
        verbose_name='Maps (full page)', blank=True)
    lectures = models.ManyToManyField('scholars.Lecture', 
        verbose_name='Lectures (full page)', blank=True)

    class Meta:
         verbose_name = "Classroom Project"

    def __str__(self):
        return self.title
