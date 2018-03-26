# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sitewide', '0004_auto_20150928_1253'),
    ]

    operations = [
        migrations.AddField(
            model_name='menu',
            name='aside_blurb',
            field=models.TextField(blank=True, default='', verbose_name='Aside box text'),
        ),
        migrations.AlterField(
            model_name='menu',
            name='menu_blurb',
            field=models.TextField(blank=True, default='', verbose_name='About this menu'),
        ),
    ]
