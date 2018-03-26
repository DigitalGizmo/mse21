# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0002_auto_20150514_1218'),
        ('documents', '0002_auto_20150514_1621'),
        ('resources', '0001_initial'),
        ('artifacts', '0003_auto_20150514_1729'),
        ('scholars', '0001_initial'),
        ('sites', '0001_initial'),
        ('connections', '0002_auto_20150514_1734'),
        ('maps', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='geomap',
            name='artifacts',
            field=models.ManyToManyField(verbose_name='Artifacts related to this Map', blank=True, to='artifacts.Artifact'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='audiovisuals',
            field=models.ManyToManyField(verbose_name='Media (slimbox)', blank=True, to='connections.Audiovisual'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='biblio',
            field=models.ManyToManyField(verbose_name='Further Study', blank=True, to='connections.Biblio'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='connections',
            field=models.ManyToManyField(verbose_name='PDFs', blank=True, to='connections.Connection'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='documents',
            field=models.ManyToManyField(verbose_name='Documents related to this Map', blank=True, to='documents.Document'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='essays',
            field=models.ManyToManyField(verbose_name='Background Info', blank=True, to='connections.Essay'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='lectures',
            field=models.ManyToManyField(verbose_name='Lectures (full page)', blank=True, to='scholars.Lecture'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='maps',
            field=models.ManyToManyField(verbose_name='Maps (full page)', help_text='Related maps will show on Active map page as well as in sidebar on Launch page.', blank=True, to='maps.Geomap'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='profiles',
            field=models.ManyToManyField(verbose_name='Choose creating Community Member(s)', blank=True, to='community.Profile'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='resourcesets',
            field=models.ManyToManyField(verbose_name='Choose Resource Sets this Map belongs to', blank=True, to='resources.Resourceset'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='sites',
            field=models.ManyToManyField(to='sites.Site'),
        ),
        migrations.AddField(
            model_name='geomap',
            name='weblinks',
            field=models.ManyToManyField(blank=True, to='connections.Weblink'),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='caption',
            field=models.CharField(verbose_name='Caption', default='', blank=True, help_text='Includes credits', max_length=255),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='chap_num',
            field=models.IntegerField(verbose_name='Chapter Number', default=0, blank=True),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='date',
            field=models.CharField(verbose_name='Date', default=0, blank=True, help_text='year or year range', max_length=16),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='location',
            field=models.CharField(verbose_name='Location', default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='narrative',
            field=models.TextField(verbose_name='Narrative', default='', blank=True),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='title',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='comparevoyage',
            name='color',
            field=models.CharField(verbose_name='Line Color', default='', blank=True, max_length=16),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='caption',
            field=models.CharField(help_text='For launch page image. Will preceed credit.', default='', blank=True, max_length=128),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='credit',
            field=models.CharField(help_text='For launch page image. Will follow caption.', default='', blank=True, max_length=128),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='date_range',
            field=models.CharField(help_text='For Voyages -- Shows under title in Compare navigation', default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='description',
            field=models.CharField(help_text='For Voyages -- blurb following date range in Compare navigation', default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='edited_by',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='narrative',
            field=models.TextField(verbose_name='About This Map', default='', blank=True),
        ),
        migrations.AlterField(
            model_name='geomap',
            name='notes',
            field=models.TextField(verbose_name='Production Notes', default='', blank=True),
        ),
        migrations.AlterField(
            model_name='idea',
            name='idea_text',
            field=models.TextField(default='', blank=True),
        ),
        migrations.AlterField(
            model_name='idea',
            name='name',
            field=models.CharField(verbose_name='Label', default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='logyear',
            name='year',
            field=models.CharField(verbose_name='Voyage - Year', default='', blank=True, max_length=4),
        ),
    ]
