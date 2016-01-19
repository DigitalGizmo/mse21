# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0003_auto_20151002_1013'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='end_time',
            field=models.TimeField(verbose_name='end time if range', blank=True, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='short_name',
            field=models.CharField(max_length=32, default='', blank=True),
        ),
        migrations.AddField(
            model_name='event',
            name='start_time',
            field=models.TimeField(verbose_name='start time or single', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='end_date',
            field=models.DateField(verbose_name='end date if range', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='start_date',
            field=models.DateField(verbose_name='start date or single', blank=True, null=True),
        ),
    ]
