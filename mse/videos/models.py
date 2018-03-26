from django.db import models
import core.models

class Video(core.models.ManyModel):
    """
    CommonModel provides:
    short_name = models.CharField(max_length=32, unique=True)
    narrative = models.TextField('About this...', blank=True, default='')
    ordinal = models.IntegerField('Order in Menu', default=99)
    notes = models.TextField('Production Notes', blank=True, default='')
    edited_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('edit date', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)
    def static_path(self):
    def resource_type_title(self):
    def resource_type(self):
    def app_namespace(self):
    def __str__(self):

    Many Model additionally provides:
        artifacts = models.ManyToManyField('artifacts.Artifact', 
        verbose_name='Artifacts related to this item', blank=True)
    audiovisuals = models.ManyToManyField('connections.Audiovisual', 
        verbose_name='Related Media (slimbox)', blank=True)
    biblio = models.ManyToManyField('connections.Biblio', 
        verbose_name='Further Study (slimbox)', blank=True)
    connections = models.ManyToManyField('connections.Connection', 
        verbose_name='Related PDFs (new tab)', blank=True)
    documents = models.ManyToManyField('documents.Document', 
        verbose_name='Documents related to this item', blank=True)
    essays = models.ManyToManyField('connections.Essay', 
        verbose_name='Background Info (slimbox)', blank=True)
    lectures = models.ManyToManyField('scholars.Lecture', 
        verbose_name='Lectures (full page)', blank=True)
    maps = models.ManyToManyField('maps.Geomap', 
        verbose_name='Maps (full page)', blank=True)
    # profiles omitted 
    resourcesets = models.ManyToManyField('resources.Resourceset', 
        verbose_name='Choose Resource Sets this item belongs to', blank=True)
    weblinks = models.ManyToManyField('connections.Weblink', blank=True)
    lessons = models.ManyToManyField('curriculum.Lesson', 
        verbose_name='Lesson PDFs (new tab)', blank=True)
    """ 
    _app_namespace = "videos"
    _resource_type = "video"
    _resource_type_title = "Video"
    _static_path = "videos"
    title = models.CharField(max_length=128)
    producer = models.CharField('Producer/Owner', 
        max_length=128, blank=True, default='')
    video_source = models.CharField('source url', 
        max_length=128, blank=True, default='')

    # return filename = short name. to be compatible with Artifacts, Docs in search results
    @property
    def filename(self):
        return self.short_name
