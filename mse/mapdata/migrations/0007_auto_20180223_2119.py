# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-02-24 02:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapdata', '0006_auto_20180223_2110'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voyage',
            name='weather_conditions',
            field=models.TextField(blank=True, default=''),
        ),
    ]