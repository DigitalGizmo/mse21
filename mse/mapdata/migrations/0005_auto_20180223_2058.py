# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-02-24 01:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapdata', '0004_auto_20180223_2055'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voyage',
            name='location_estimated',
            field=models.CharField(blank=True, default='', max_length=128),
        ),
    ]
