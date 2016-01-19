# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0004_auto_20151113_1456'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='event',
            options={'ordering': ['start_date', 'start_time']},
        ),
        migrations.AlterField(
            model_name='event',
            name='end_date',
            field=models.DateField(blank=True, null=True, verbose_name='end date - only if multi-day'),
        ),
        migrations.AlterField(
            model_name='event',
            name='end_time',
            field=models.TimeField(blank=True, null=True, verbose_name='end time (on start date) if range '),
        ),
        migrations.AlterField(
            model_name='event',
            name='short_name',
            field=models.SlugField(unique=True, max_length=32),
        ),
    ]
