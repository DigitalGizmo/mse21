# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-03-09 19:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapdata', '0012_auto_20180309_1438'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voyage',
            name='spotted_species',
            field=models.CharField(blank=True, default='', max_length=128),
        ),
    ]
