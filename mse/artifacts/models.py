from django.db import models
#from connections.models import Connection
#Weblink, Biblio, Essay
 
import datetime

class Artifact(models.Model):
    STATUS_NUMS = (
        (1,'1 - Entered'),
        (2,'2 - TBD'),
        (3,'3 - Work in progress'),
        (4,'4 - Published'),
    )
    id_number = models.CharField(max_length=64, blank=True, default='')
    filename = models.CharField(max_length=64, blank=True, default='')
    short_name = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=128)
    object_name = models.CharField(max_length=128, blank=True, default='')
    maker = models.CharField(max_length=64, blank=True, default='')
    assoc_place = models.CharField(max_length=64, blank=True, default='')
    date_made = models.CharField(max_length=64, blank=True, default='')
    materials = models.CharField(max_length=128, blank=True, default='')
    measurements = models.CharField(max_length=128, blank=True, default='')
    description = models.TextField('Short Description', blank=True, default='')
    narrative = models.TextField('Narrative', blank=True, default='')
    credit_line = models.CharField(max_length=128, blank=True, default='')
    is_vertical = models.BooleanField()
    ordinal = models.IntegerField('Order in Menu', default=99)
    notes = models.TextField('Production Notes', blank=True, default='')
    edited_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('edit date', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)
    augmented = models.BooleanField()
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)
    resourcesets = models.ManyToManyField('resources.Resourceset', 
        verbose_name='Choose Resource Sets this Artifact belongs to', blank=True)
    artifacts = models.ManyToManyField('artifacts.Artifact', 
        verbose_name='Other Artifacts related to this Artifact', blank=True)
    documents = models.ManyToManyField('documents.Document', 
        verbose_name='Documents related to this Artifact', blank=True)
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

    def __str__(self):
        return self.title

class Question(models.Model):
    artifact = models.ForeignKey('artifacts.Artifact')
    question_text = models.CharField(max_length=255)
    question_num = models.IntegerField()
    
    def __str__(self):
        return self.question_text

class Idea(models.Model):
    artifact = models.ForeignKey('artifacts.Artifact')
    name = models.CharField('Label', max_length=64, blank=True, default='')
    idea_text = models.TextField(blank=True, default='')
    idea_num = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    
class Page(models.Model):
    artifact = models.ForeignKey('artifacts.Artifact')
    page_suffix = models.CharField('filename suffix', max_length=64, blank=True, default='')
    page_label = models.CharField('view label', max_length=64, blank=True, default='')
    page_num = models.IntegerField('view order')

    class Meta:
         verbose_name = "View"
    def __str__(self):
        return self.page_label
    
