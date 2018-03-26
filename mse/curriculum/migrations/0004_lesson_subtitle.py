# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0003_auto_20151002_1013'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='subtitle',
            field=models.CharField(default='', blank=True, max_length=128),
        ),
    ]
