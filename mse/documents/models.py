from django.db import models
import datetime

class Document(models.Model):
    STATUS_NUMS = (
        (1,'1 - Entered'),
        (2,'2 - TBD'),
        (3,'3 - Work in progress'),
        (4,'4 - Published'),
    )
    title = models.CharField(max_length=128)
    short_name = models.CharField(max_length=32, unique=True)
    bibid = models.CharField(max_length=32, blank=True, default='')
    filename = models.CharField(max_length=64, blank=True, default='')
    object_name = models.CharField(max_length=128, blank=True, default='')
    augmented = models.BooleanField()
    description = models.TextField('Short Description', blank=True, default='')
    narrative = models.TextField('About this..', blank=True, default='')
    hist_context = models.TextField('Historic Context', blank=True, default='')
    author = models.CharField(max_length=64, blank=True, default='')
    date_made = models.CharField(max_length=64)
    identifier = models.CharField('Locator', max_length=64)
    ordinal = models.IntegerField('Order in Menu', default=999)
    notes = models.TextField('Production Notes', blank=True, default='')
    edited_by = models.CharField(max_length=64, blank=True, default='')
    read_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('date edited', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)
    resourcesets = models.ManyToManyField('resources.Resourceset', 
        verbose_name='Resource Sets to which this Document belongs', blank=True)
    artifacts = models.ManyToManyField('artifacts.Artifact', 
        verbose_name='Artifacts related to this Document', blank=True)
    documents = models.ManyToManyField('documents.Document', 
        verbose_name='Other Documents related to this Document', blank=True)
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
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)

    @property
    def first_page_suffix(self):
        if self.page_set.all():
            _first_page = self.page_set.all()[0]
            _page_suffix = _first_page.page_suffix 
        else:
            _page_suffix = "01"
        return _page_suffix 

    def __str__(self):
        return self.short_name


class Question(models.Model):
    document = models.ForeignKey('documents.Document')
    question_text = models.CharField(max_length=255)
    question_num = models.IntegerField(default=0)

    def __str__(self):
        return self.question_text


class Page(models.Model):
    document = models.ForeignKey('documents.Document')
    page_suffix = models.CharField('filename suffix', max_length=64, blank=True, default='')
    page_label = models.CharField('page label', max_length=64, blank=True, default='')
    page_num = models.IntegerField('page order')
    transcript = models.TextField('Transcription', blank=True, default='')

    def __str__(self):
        return self.page_label

    class Meta:
        ordering = ['page_num']


class Idea(models.Model):
    document = models.ForeignKey('documents.Document')
    name = models.CharField('Label', max_length=64, blank=True, default='')
    idea_text = models.TextField(blank=True, default='')
    idea_num = models.IntegerField(default=0)

    def __str__(self):
        return self.name
