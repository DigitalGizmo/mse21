# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-03-12 16:22
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mapdata', '0015_auto_20180309_1501'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='voyage',
            options={'ordering': ['year', 'month', 'day']},
        ),
    ]