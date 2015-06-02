# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0001_initial'),
        ('maps', '0001_initial'),
        ('scholars', '0001_initial'),
        ('documents', '0001_initial'),
        ('connections', '0001_initial'),
        ('artifacts', '0002_auto_20150508_1532'),
        ('community', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='artifacts',
            field=models.ManyToManyField(blank=True, verbose_name='Artifacts related to this Project', to='artifacts.Artifact'),
        ),
        migrations.AddField(
            model_name='project',
            name='audiovisuals',
            field=models.ManyToManyField(blank=True, verbose_name='Media (slimbox)', to='connections.Audiovisual'),
        ),
        migrations.AddField(
            model_name='project',
            name='biblio',
            field=models.ManyToManyField(blank=True, verbose_name='Further Study (slimbox)', to='connections.Biblio'),
        ),
        migrations.AddField(
            model_name='project',
            name='connections',
            field=models.ManyToManyField(blank=True, verbose_name='PDFs (new tab)', to='connections.Connection'),
        ),
        migrations.AddField(
            model_name='project',
            name='documents',
            field=models.ManyToManyField(blank=True, verbose_name='Documents related to this Project', to='documents.Document'),
        ),
        migrations.AddField(
            model_name='project',
            name='essays',
            field=models.ManyToManyField(blank=True, verbose_name='Background Info (slimbox)', to='connections.Essay'),
        ),
        migrations.AddField(
            model_name='project',
            name='lectures',
            field=models.ManyToManyField(blank=True, verbose_name='Lectures (full page)', to='scholars.Lecture'),
        ),
        migrations.AddField(
            model_name='project',
            name='maps',
            field=models.ManyToManyField(blank=True, verbose_name='Maps (full page)', to='maps.Geomap'),
        ),
        migrations.AddField(
            model_name='project',
            name='profiles',
            field=models.ManyToManyField(blank=True, verbose_name='Choose creating Community Member(s)', to='community.Profile'),
        ),
        migrations.AddField(
            model_name='project',
            name='resourcesets',
            field=models.ManyToManyField(blank=True, verbose_name='Choose Resource Sets this Project belongs to', to='resources.Resourceset'),
        ),
        migrations.AddField(
            model_name='project',
            name='weblinks',
            field=models.ManyToManyField(blank=True, to='connections.Weblink'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='edited_by',
            field=models.CharField(default='', max_length=64, blank=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='institution',
            field=models.CharField(default='', max_length=128, blank=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='location',
            field=models.CharField(default='', max_length=128, blank=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='narrative',
            field=models.TextField(default='', blank=True, verbose_name='Narrative'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='notes',
            field=models.TextField(default='', blank=True, verbose_name='Production Notes'),
        ),
        migrations.AlterField(
            model_name='project',
            name='edited_by',
            field=models.CharField(default='', max_length=64, blank=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='narrative',
            field=models.TextField(default='', blank=True, verbose_name='Narrative'),
        ),
        migrations.AlterField(
            model_name='project',
            name='notes',
            field=models.TextField(default='', blank=True, verbose_name='Production Notes'),
        ),
    ]
