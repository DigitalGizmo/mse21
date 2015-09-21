from django.db import models

class Menu(models.Model):
    short_name = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=128)
    menu_blurb = models.TextField('Narrative', blank=True, default='')
    has_icon = models.BooleanField(default=True)

    def __str__(self):
        return self.title
