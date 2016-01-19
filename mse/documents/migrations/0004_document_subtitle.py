# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0003_auto_20150602_1219'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='subtitle',
            field=models.CharField(max_length=128, blank=True, default=''),
        ),
    ]
