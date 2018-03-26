# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0005_remove_geomap_augmented'),
    ]

    operations = [
        migrations.AddField(
            model_name='geomap',
            name='subtitle',
            field=models.CharField(max_length=128, blank=True, default=''),
        ),
    ]
