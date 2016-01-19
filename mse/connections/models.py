from django.db import models
import datetime

class Connection(models.Model):
    LINK_TYPES = (
        ('pdf','pdf'),
        ('tbd','to be determined'),
    )
    LINK_HEADINGS = (
        ('worksheet','Worksheet'),
        ('visual','Visual'),
        ('related','Related Resources'),
        ('classroom','In the Classroom'),
     )
    link_text = models.CharField(max_length=128)
    to_short_name = models.CharField(max_length=32, blank=True, default='')
    link_type = models.CharField(max_length=16, choices=LINK_TYPES, default='pdf')
    link_heading = models.CharField(max_length=16, choices=LINK_HEADINGS, default='related')
    edit_date = models.DateTimeField('date edited', default=datetime.datetime.now)  

    class Meta:
         verbose_name = "PDF"

    def __str__(self):
        return self.link_text

class Weblink(models.Model):
    link_text = models.CharField(max_length=128)
    link_url = models.CharField(max_length=128, blank=True, default='')
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return self.link_text

class Biblio(models.Model):
    BIBLIO_TYPES = (
        ('source','Source'),
        ('related_arts','Art, Film, Lit'),
    )
    title = models.CharField(max_length=128)
    citation = models.CharField(max_length=255, blank=True, default='')
    biblio_type = models.CharField(max_length=16, choices=BIBLIO_TYPES, default='source')
    description = models.TextField(blank=True, default='')

    class Meta:
         verbose_name = "Further Study"

    def __str__(self):
        return self.title


class Essay(models.Model):
    short_name = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=192)
    narrative = models.TextField('Background Essay', blank=True, default='')

    class Meta:
         verbose_name = "Background Info"

    def __str__(self):
        return self.title


class Moreinfo(models.Model):
    short_name = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=192)
    has_image = models.BooleanField()
    credit_line = models.CharField(max_length=128, blank=True, default='')
    narrative = models.TextField('Narrative', blank=True, default='')

    def __str__(self):
        return self.short_name


class Audiovisual(models.Model):
    MEDIA_TYPES = (
        ('Image','Image'),
        ('Video','Video'),
        ('Audio','Audio'),
        ('Slideshow','Slideshow'),
    )
    short_name = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=192)
    credit_line = models.CharField(max_length=128, blank=True, default='')
    narrative = models.TextField('Narrative', blank=True, default='')
    media_type = models.CharField(max_length=16, choices=MEDIA_TYPES, default='image',
            help_text="images go in olc/connections/static/connections/audiovisuals/images/, " \
            "audio in ../audiovisuals/audio, etc.")

    class Meta:
         verbose_name = "Media"

    def __str__(self):
        return self.short_name


class Slide(models.Model):
    audiovisual = models.ForeignKey('connections.Audiovisual')
    slide_num = models.IntegerField(
            help_text="File naming: olc/connections/static/connections/audiovisuals/slides/"\
            "short_name_1, short_name_2, etc.")
    credit_line = models.CharField(max_length=128, blank=True, default='',
            help_text="For each slide -- Slides ignore Credit Line at top of form.")
    narrative = models.TextField('Caption', blank=True, default='',
            help_text="caption for each slide -- slides ignore Narrative at top of form.")

    class Meta:
         verbose_name = "Slides - only for Slideshow"
         
    def __str__(self):
        return self.credit_line
