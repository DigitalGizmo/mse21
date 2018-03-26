# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0003_auto_20151002_1013'),
        ('maps', '0006_geomap_subtitle'),
    ]

    operations = [
        migrations.AddField(
            model_name='geomap',
            name='lessons',
            field=models.ManyToManyField(verbose_name='Lesson PDFs (new tab)', to='curriculum.Lesson', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='artifacts',
            field=models.ManyToManyField(verbose_name='Artifacts related to this item', to='artifacts.Artifact', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='audiovisuals',
            field=models.ManyToManyField(verbose_name='Related Media (slimbox)', to='connections.Audiovisual', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='biblio',
            field=models.ManyToManyField(verbose_name='Further Study (slimbox)', to='connections.Biblio', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='connections',
            field=models.ManyToManyField(verbose_name='Related PDFs (new tab)', to='connections.Connection', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='documents',
            field=models.ManyToManyField(verbose_name='Documents related to this item', to='documents.Document', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='essays',
            field=models.ManyToManyField(verbose_name='Background Info (slimbox)', to='connections.Essay', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='maps',
            field=models.ManyToManyField(verbose_name='Maps (full page)', to='maps.Geomap', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='narrative',
            field=models.TextField(verbose_name='About this...', default='', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='ordinal',
            field=models.IntegerField(verbose_name='Order in Menu', default=99),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='resourcesets',
            field=models.ManyToManyField(verbose_name='Choose Resource Sets this item belongs to', to='resources.Resourceset', blank=True),
        ),
    ]
