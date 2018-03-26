# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('artifacts', '0008_auto_20151119_1609'),
        ('resources', '0004_auto_20151022_2137'),
        ('scholars', '0004_auto_20151023_0933'),
        ('maps', '0007_auto_20151022_2133'),
        ('connections', '0005_auto_20151119_1609'),
        ('documents', '0009_auto_20151119_1609'),
        ('curriculum', '0004_lesson_subtitle'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='author',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='description',
        ),
        migrations.AddField(
            model_name='lesson',
            name='artifacts',
            field=models.ManyToManyField(blank=True, verbose_name='Artifacts related to this item', to='artifacts.Artifact'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='audiovisuals',
            field=models.ManyToManyField(blank=True, verbose_name='Related Media (slimbox)', to='connections.Audiovisual'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='biblio',
            field=models.ManyToManyField(blank=True, verbose_name='Further Study (slimbox)', to='connections.Biblio'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='connections',
            field=models.ManyToManyField(blank=True, verbose_name='Related PDFs (new tab)', to='connections.Connection'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='documents',
            field=models.ManyToManyField(blank=True, verbose_name='Documents related to this item', to='documents.Document'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='edit_date',
            field=models.DateTimeField(default=datetime.datetime.now, verbose_name='edit date'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='edited_by',
            field=models.CharField(blank=True, default='', max_length=64),
        ),
        migrations.AddField(
            model_name='lesson',
            name='essays',
            field=models.ManyToManyField(blank=True, verbose_name='Background Info (slimbox)', to='connections.Essay'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='lectures',
            field=models.ManyToManyField(blank=True, verbose_name='Lectures (full page)', to='scholars.Lecture'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='lessons',
            field=models.ManyToManyField(blank=True, verbose_name='Lesson PDFs (new tab)', to='curriculum.Lesson'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='maps',
            field=models.ManyToManyField(blank=True, verbose_name='Maps (full page)', to='maps.Geomap'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='narrative',
            field=models.TextField(blank=True, default='', verbose_name='About this...'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='notes',
            field=models.TextField(blank=True, default='', verbose_name='Production Notes'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='ordinal',
            field=models.IntegerField(default=99, verbose_name='Order in Menu'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='resourcesets',
            field=models.ManyToManyField(blank=True, verbose_name='Choose Resource Sets this item belongs to', to='resources.Resourceset'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='status_num',
            field=models.IntegerField(choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')], default=0),
        ),
        migrations.AddField(
            model_name='lesson',
            name='weblinks',
            field=models.ManyToManyField(blank=True, to='connections.Weblink'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='short_name',
            field=models.CharField(unique=True, max_length=32),
        ),
    ]
