# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='end_date',
            field=models.DateTimeField(null=True, blank=True, verbose_name='end date if range'),
        ),
    ]
