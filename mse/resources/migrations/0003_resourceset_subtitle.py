# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0002_auto_20150515_1029'),
    ]

    operations = [
        migrations.AddField(
            model_name='resourceset',
            name='subtitle',
            field=models.CharField(max_length=128, blank=True, default=''),
        ),
    ]
