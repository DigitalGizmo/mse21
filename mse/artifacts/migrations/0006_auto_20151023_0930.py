# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0003_auto_20151002_1013'),
        ('artifacts', '0005_auto_20151013_1549'),
    ]

    operations = [
        migrations.AddField(
            model_name='artifact',
            name='lessons',
            field=models.ManyToManyField(blank=True, to='curriculum.Lesson', verbose_name='Lesson PDFs (new tab)'),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='initial_x',
            field=models.IntegerField(blank=True, null=True, verbose_name='Default (blank) is 0 (centered)'),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='initial_y',
            field=models.IntegerField(blank=True, null=True, verbose_name='Default (blank) is 0 (centered)'),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='initial_zoom',
            field=models.IntegerField(blank=True, null=True, verbose_name='Default (blank) is 50 (%)'),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='narrative',
            field=models.TextField(default='', blank=True, verbose_name='About this...'),
        ),
    ]
