from django.db import models
import datetime
import sitewide.models

class Event(models.Model):
    _app_namespace = "about"
    _resource_type = "event"
    short_name = models.SlugField(max_length=32, unique=True)
    title = models.CharField(max_length=128)
    subtitle = models.CharField(max_length=128, blank=True, default='')
    description = models.TextField(blank=True, default='')
    details = models.TextField(blank=True, default='')
    start_date = models.DateField('start date or single', null=True, blank=True)
    end_date = models.DateField('end date - only if multi-day', null=True, blank=True)
    time_details = models.CharField(max_length=128, blank=True, default='')
    location = models.CharField(max_length=128, blank=True, default='')
    cost = models.CharField(max_length=64, blank=True, default='')
    on_home = models.BooleanField(default=False)
    contact_name = models.CharField(max_length=32, blank=True, default='')
    contact_email = models.CharField(max_length=64, blank=True, default='')
    contact_phone = models.CharField(max_length=32, blank=True, default='')
    ordinal = models.IntegerField('Order in Menu', default=99)

    class Meta:
        ordering = ['start_date']

    # return list containing name and domain parts of email address
    @property
    def contact_email_parts(self):
        return self.contact_email.split("@")

    # return app_namespace
    @property
    def app_namespace(self):
        return Event._app_namespace

    # return resource_type
    @property
    def resource_type(self):
        return Event._resource_type

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='event')

    def __str__(self):
        return self.title


class Scene(models.Model):
    """
    Really should be called Blog, but called Scene for consistency with our menu.
    """
    _app_namespace = "about"
    _resource_type = "scene"
    short_name = models.SlugField(max_length=32, unique=True)
    title = models.CharField(max_length=128)
    subtitle = models.CharField(max_length=128, blank=True, default='')
    narrative = models.TextField(blank=True, default='')
    posted = models.DateField('Date posted', null=True, blank=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        ordering = ['posted']

    # return app_namespace
    @property
    def app_namespace(self):
        return self._app_namespace

    # return resource_type
    @property
    def resource_type(self):
        return self._resource_type

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='scene')

    def __str__(self):
        return self.title


class Single(models.Model):
    short_name = models.SlugField(max_length=32, unique=True)
    title = models.CharField(max_length=128)
    subtitle = models.CharField(max_length=128, blank=True, default='')
    narrative = models.TextField(blank=True, default='')

    def __str__(self):
        return self.title
