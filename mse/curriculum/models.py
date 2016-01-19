from django.db import models
#from django.db.models import Count
from django.conf import settings
import sitewide.models
import core.models
from artifacts.models import Artifact


class Gradelevel(models.Model):
    """docstring for Gradelevel"""
    short_name = models.SlugField(max_length=32, unique=True)
    title = models.CharField(max_length=192)
    ordinal = models.IntegerField('Order in Menu', default=99)

    class Meta:
        ordering = ['ordinal']
        
    def __str__(self):
        return self.title       


class Subject(models.Model):
    """docstring for Subject"""
    short_name = models.SlugField(max_length=32, unique=True)
    title = models.CharField(max_length=192)
    ordinal = models.IntegerField('Order in Menu', default=99)

    class Meta:
        ordering = ['ordinal']
        
    def __str__(self):
        return self.title       


class Lesson(core.models.ManyModel):
    """
    Lesson
    The ManyToManyFields are included here, rather than inheriting ManyModel,
    because ManyModel includes CommonModel which conflicts in short_name field type,
    (slug) as well has having fields that aren't needed (narrative..)
    """
    _app_namespace = "curriculum"
    _resource_type = "lesson"
    title = models.CharField(max_length=192)
    subtitle = models.CharField(max_length=128, blank=True, default='')
    # common fields from Common Model: short_name, narrative, ordinal, notes, edited_by,
    # status_num
    # many to many fields from core ManyModel
    gradelevels = models.ManyToManyField('curriculum.Gradelevel', 
        verbose_name='Grade-levels related to this Lesson', blank=True)
    subjects = models.ManyToManyField('curriculum.Subject', 
        verbose_name='Subjects related to this Lesson', blank=True)
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)

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

    # return app_namespace
    @property
    def app_namespace(self):
        return Lesson._app_namespace

    # return resource_type
    @property
    def resource_type(self):
        return Lesson._resource_type

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='lesson')

    def __str__(self):
        return self.title       


class Supplement(models.Model):
    lesson = models.ForeignKey('curriculum.Lesson')
    title = models.CharField(max_length=192)
    sup_num = models.IntegerField()
    ordinal = models.IntegerField('Order in Menu', default=99)
    
    class Meta:
        ordering = ['ordinal', 'sup_num']

    def __str__(self):
        return self.title

