# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-02-24 03:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapdata', '0007_auto_20180223_2119'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voyage',
            name='lat_sec',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='voyage',
            name='lon_sec',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
