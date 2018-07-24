from django.db import models
import datetime
import core.models
import sitewide.models

class Artifact(core.models.ItemModel):
    """
    Artifact detail pages get resource_type from the instance
    Arifact Menus get the equivalent from menu_info.short_name
    """
    _app_namespace = "artifacts"
    _resource_type = "artifact"
    _resource_type_title = "Artifact"
    _static_path = "artifacts"
    id_number = models.CharField(max_length=64, blank=True, default='')
    object_name = models.CharField(max_length=128, blank=True, default='')
    maker = models.CharField(max_length=64, blank=True, default='')
    assoc_place = models.CharField(max_length=64, blank=True, default='')
    date_made = models.CharField(max_length=64, blank=True, default='')
    materials = models.CharField(max_length=128, blank=True, default='')
    measurements = models.CharField(max_length=128, blank=True, default='')
    credit_line = models.CharField(max_length=128, blank=True, default='')
    is_vertical = models.BooleanField()
    # init zoom and x are shared from core.
    initial_y = models.IntegerField('Y - Default (blank) is 0 (centered)', null=True, 
        blank=True)

    # return title without <i> </i>
    @property
    def title_no_markup(self):
        return self.title.replace("<i>", "").replace("</i>", "").replace("<em>", 
            "").replace("</em>", "")

    # return menu object
    @property
    def menu_info(self):
        return sitewide.models.Menu.objects.get(short_name='artifact')

    def __str__(self):
        return self.title

class Question(models.Model):
    artifact = models.ForeignKey('artifacts.Artifact', on_delete=models.CASCADE)
    question_text = models.CharField(max_length=255)
    question_num = models.IntegerField()
    
    def __str__(self):
        return self.question_text

class Idea(models.Model):
    artifact = models.ForeignKey('artifacts.Artifact', on_delete=models.CASCADE)
    name = models.CharField('Label', max_length=64, blank=True, default='')
    idea_text = models.TextField(blank=True, default='')
    idea_num = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    
class Page(models.Model):
    artifact = models.ForeignKey('artifacts.Artifact', on_delete=models.CASCADE)
    page_suffix = models.CharField('filename suffix', max_length=64, blank=True, 
        default='')
    page_label = models.CharField('view label', max_length=64, blank=True, default='')
    page_num = models.IntegerField('view order')

    class Meta:
         verbose_name = "View"
    def __str__(self):
        return self.page_label
    
