# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0005_auto_20151116_1051'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='subtitle',
            field=models.CharField(default='', blank=True, max_length=128),
        ),
        migrations.AddField(
            model_name='event',
            name='time_details',
            field=models.CharField(default='', blank=True, max_length=128),
        ),
        migrations.AlterField(
            model_name='event',
            name='end_time',
            field=models.TimeField(null=True, blank=True, verbose_name='end time for single date'),
        ),
        migrations.AlterField(
            model_name='event',
            name='start_time',
            field=models.TimeField(null=True, blank=True, verbose_name='start time for single date'),
        ),
    ]
