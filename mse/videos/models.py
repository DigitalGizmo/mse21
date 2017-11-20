from django.db import models
import core.models

class Video(core.models.CommonModel):
    """
    CommonModel provides:
    short_name = models.CharField(max_length=32, unique=True)
    narrative = models.TextField('About this...', blank=True, default='')
    ordinal = models.IntegerField('Order in Menu', default=99)
    notes = models.TextField('Production Notes', blank=True, default='')
    edited_by = models.CharField(max_length=64, blank=True, default='')
    edit_date = models.DateTimeField('edit date', default=datetime.datetime.now)
    status_num = models.IntegerField(default=0, choices=STATUS_NUMS)
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

