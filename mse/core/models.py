from django.db import models
from django.conf import settings
import datetime

class CommonModel(models.Model):
    """
    Abstract class for fields common to Artifacts, Documents,
    Maps, Lecture, Project, Resourceset
    """
    STATUS_NUMS = (
        (1,'1 - Entered'),
        (2,'2 - TBD'),
        (3,'3 - Work in progress'),
        (4,'4 - Published'),
    )
    short_name = models.CharField(max_length=32, unique=True)
    narrative = models.TextField('About this...', blank=True, default='')
    ordinal = models.IntegerField('Order in Menu', default=99)
    notes = models.TextField('Production Notes', blank=True, default='')
    edited_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('edit date', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)

    # return static_path -- class variable in each class
    @property
    def static_path(self):
        return self._static_path

    # return resource_type_title -- for search results
    @property
    def resource_type_title(self):
        return self._resource_type_title

    # return resource_type
    @property
    def resource_type(self):
        return self._resource_type

    # return app_namespace
    @property
    def app_namespace(self):
        return self._app_namespace

    class Meta:
        abstract = True

    def __str__(self):
        return self.short_name

class ManyModel(CommonModel):
    """
    Abstract class for many to many fields common to Artifacts, Documents,
    Maps, Lecture, Project
    """
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
    # profiles omitted because Lecture doesn't use it.
    resourcesets = models.ManyToManyField('resources.Resourceset', 
        verbose_name='Choose Resource Sets this item belongs to', blank=True)
    weblinks = models.ManyToManyField('connections.Weblink', blank=True)
    lessons = models.ManyToManyField('curriculum.Lesson', 
        verbose_name='Lesson PDFs (new tab)', blank=True)
    videos = models.ManyToManyField('videos.Video', 
        verbose_name='Videos related to this item', blank=True)

    class Meta:
        abstract = True

    # determine condition for showing Related Items heading
    @property
    def has_items(self):
        if (self.artifacts.filter(status_num__gte=settings.STATUS_LEVEL).count() > 0 or
            self.documents.filter(status_num__gte=settings.STATUS_LEVEL).count() > 0):
            return True
        else:
            return False

    # return list of related artifacts
    @property
    def related_artifacts(self):
        return self.artifacts.filter(status_num__gte=settings.STATUS_LEVEL)

    # return list of related documents
    @property
    def related_documents(self):
        return self.documents.filter(status_num__gte=settings.STATUS_LEVEL)

    def __str__(self):
        return self.short_name

class ItemModel(ManyModel):
    """
    Item - abstract class for fields common to Artifacts and Documents
    """
    title = models.CharField(max_length=128)
    subtitle = models.CharField(max_length=128, blank=True, default='')
    filename = models.CharField(max_length=64, blank=True, default='')
    description = models.TextField('Short Description', blank=True, default='')
    augmented = models.BooleanField()
    initial_zoom = models.IntegerField('Initial zoom - Default (blank) is 50 (%)', null=True, blank=True)
    initial_x = models.IntegerField('X - Default (blank) is 0 (centered)',null=True, blank=True)
    # initial_y varies between artifacts and documents, so is in model for each.
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)

    class Meta:
        abstract = True

    # set zoom level and placement
    @property
    def zoom_settings(self):
        _zoom_settings = "zInitialZoom=50&"
        if self.initial_zoom:
            _zoom_settings = "zInitialZoom=" + str(self.initial_zoom) +"&"
        if self.initial_x:
            _zoom_settings += "zInitialX=" + str(self.initial_x) +"&"
        if self.initial_y:
            _zoom_settings += "zInitialY=" + str(self.initial_y) +"&"
        return _zoom_settings
    
    def __str__(self):
        return self.short_name

