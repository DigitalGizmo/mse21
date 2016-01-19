from django.db import models
import datetime
import core.models
import sitewide.models

class Document(core.models.ItemModel):
    """
    Document detail pages get resource_type from the instance
    Document Menus get the equivalent from menu_info.short_name
    """
    _app_namespace = "documents"
    _resource_type = "document"
    _resource_type_title = "Document"
    _static_path = "documents"
    bibid = models.CharField(max_length=32, blank=True, default='')
    object_name = models.CharField(max_length=128, blank=True, default='')
    hist_context = models.TextField('Historic Context', blank=True, default='')
    author = models.CharField(max_length=64, blank=True, default='')
    date_made = models.CharField(max_length=64)
    identifier = models.CharField('Locator', max_length=64)
    read_by = models.CharField(max_length=64, blank=True, default='')
    # override core for separate default for doc y - top of page
    initial_y = models.IntegerField('Y - Default is 1 (top of page)', 
        null=True, blank=True, default=1)
    
    @property
    def first_page(self):
        return self.page_set.all()[0] 

    # return title without <i> </i>
    @property
    def title_no_markup(self):
        return self.title.replace("<i>", "").replace("</i>", "").replace("<em>", 
            "").replace("</em>", "")

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='document')


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
