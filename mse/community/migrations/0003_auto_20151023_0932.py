# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0003_auto_20151002_1013'),
        ('community', '0002_auto_20150514_1218'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='lessons',
            field=models.ManyToManyField(blank=True, to='curriculum.Lesson', verbose_name='Lesson PDFs (new tab)'),
        ),
        migrations.AddField(
            model_name='project',
            name='subtitle',
            field=models.CharField(blank=True, max_length=128, default=''),
        ),
        migrations.AlterField(
            model_name='profile',
            name='narrative',
            field=models.TextField(blank=True, verbose_name='About this...', default=''),
        ),
        migrations.AlterField(
            model_name='profile',
            name='ordinal',
            field=models.IntegerField(verbose_name='Order in Menu', default=99),
        ),
        migrations.AlterField(
            model_name='project',
            name='artifacts',
            field=models.ManyToManyField(blank=True, to='artifacts.Artifact', verbose_name='Artifacts related to this item'),
        ),
        migrations.AlterField(
            model_name='project',
            name='audiovisuals',
            field=models.ManyToManyField(blank=True, to='connections.Audiovisual', verbose_name='Related Media (slimbox)'),
        ),
        migrations.AlterField(
            model_name='project',
            name='connections',
            field=models.ManyToManyField(blank=True, to='connections.Connection', verbose_name='Related PDFs (new tab)'),
        ),
        migrations.AlterField(
            model_name='project',
            name='documents',
            field=models.ManyToManyField(blank=True, to='documents.Document', verbose_name='Documents related to this item'),
        ),
        migrations.AlterField(
            model_name='project',
            name='narrative',
            field=models.TextField(blank=True, verbose_name='About this...', default=''),
        ),
        migrations.AlterField(
            model_name='project',
            name='ordinal',
            field=models.IntegerField(verbose_name='Order in Menu', default=99),
        ),
        migrations.AlterField(
            model_name='project',
            name='resourcesets',
            field=models.ManyToManyField(blank=True, to='resources.Resourceset', verbose_name='Choose Resource Sets this item belongs to'),
        ),
    ]
