from django.db import models
from django.contrib.sites.models import Site
import datetime
import sitewide.models
import core.models

class Geomap(core.models.ManyModel):
    _app_namespace = "maps"
    _resource_type = "geomap"
    _resource_type_title = "Map"
    _static_path = "maps"
    MAP_TYPES = (
        ('Voyage', 'Voyage'),
        ('Story', 'Story'),
        ('Compare', 'Compare'),
    )
    LOG_LINK_TYPES = (
        (0,'0 - No links'),
        (1,'1 - Logbook MSE collections'),
        (2,'2 - slim journal pages'),
    )
    title = models.CharField(max_length=128)
    subtitle = models.CharField(max_length=128, blank=True, default='')
    fusion_table_id = models.CharField(max_length=64, default='add id for fusion table',
            help_text="For Voyages and Compare (not Story). Currently supplied by Don")
    map_type = models.CharField(max_length=16, default='Voyage', choices=MAP_TYPES)
    init_lat = models.FloatField("Initial Latitude", blank=True, null=True,
        help_text="Decimal degrees, South is negative. Right click on google maps - What's Here.")
    init_long = models.FloatField("Initial Longitude", blank=True, null=True,
        help_text="Decimal degrees, West is negative")
    init_zoom = models.IntegerField("Initial Zoom Level", default=3,
        help_text="0= entire world, 3= most of hemisphere, 9 = area like Connecticut, 12= buildings")
    date_range = models.CharField(max_length=64, blank=True, default='', 
        help_text="For Voyages -- Shows under title in Compare navigation")
    description = models.CharField(max_length=64, blank=True, default='', 
        help_text="For Voyages -- blurb following date range in Compare navigation")
    caption = models.CharField(max_length=128, blank=True, default='', 
        help_text="For launch page image. Will preceed credit.")
    credit = models.CharField(max_length=128, blank=True, default='', 
        help_text="For launch page image. Will follow caption.")
    log_link_type = models.IntegerField(default=0, choices=LOG_LINK_TYPES)
    # For MPMRC
    sites = models.ManyToManyField(Site)
    # extra manys
    profiles = models.ManyToManyField('community.Profile', 
        verbose_name='Choose creating Community Member(s)', blank=True)

    class Meta:
         verbose_name = "map"

    # return title without <i> </i>
    @property
    def title_no_markup(self):
        return self.title.replace("<i>", "").replace("</i>", "").replace("<em>", 
            "").replace("</em>", "")

    # return filename = short name. to be compatible with Artifacts, Docs in search results
    @property
    def filename(self):
        return self.short_name

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='map')

    def __str__(self):
        return self.title


class Idea(models.Model):
    geomap = models.ForeignKey('maps.Geomap')
    name = models.CharField('Label', max_length=64, blank=True, default='')
    idea_text = models.TextField(blank=True, default='')
    idea_num = models.IntegerField(default=0)

    class Meta:
         verbose_name = "Ideas for Classroom Use"

    def __str__(self):
        return self.name

class Logyear(models.Model):
    geomap = models.ForeignKey('maps.Geomap')
    year = models.CharField('Voyage - Year', max_length=4, blank=True, default='')

    class Meta:
         verbose_name = "Voyage map only - Logyear"

    def __str__(self):
        return self.year
        

class Comparevoyage(models.Model):
    geomap = models.ForeignKey('maps.Geomap')
    label = models.CharField('nickname for this voyage', max_length=32, unique=True)
    voyage_id = models.IntegerField('voyage map ID', default=0,
            help_text="look for number in admin edit link for map in question")    
    ordinal = models.IntegerField('Order in Menu', default=999)    
    color = models.CharField('Line Color', max_length=16, blank=True, default='')

    class Meta:
         verbose_name = "Compare map only - Voyage map IDs"
         
    def __str__(self):
        return self.label
        

class Chapter(models.Model):
    geomap = models.ForeignKey('maps.Geomap')
    chap_num = models.IntegerField("Chapter Number", blank=True, null=True)
    latitude = models.FloatField("Latitude", blank=True, null=True)
    longitude = models.FloatField("Longitude", blank=True, null=True)
    zoom_level = models.IntegerField("Chapter Zoom Level", default=3,
        help_text="Same range as for initial zoom.")
    location = models.CharField("Location", max_length=64, blank=True, default='')
    date = models.CharField("Date", max_length=16, blank=True, default='',
            help_text="year or year range")
    title = models.CharField(max_length=64, blank=True, default='')
    has_image = models.BooleanField(
        help_text="goes in: /sites/olc/maps/static/maps/chapics/shortname_chap# <br> large: /sites/olc/maps/static/maps/chaplarge/shortname_chap# " )
    caption = models.CharField('Caption', max_length=255, blank=True, default='',
            help_text="Includes credits")
    narrative = models.TextField('Narrative', blank=True, default='')

    class Meta:
         verbose_name = "Story map - Chapter"

    def __str__(self):
        return self.title

