# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0001_initial'),
        ('community', '0002_auto_20150514_1218'),
        ('scholars', '0001_initial'),
        ('connections', '0001_initial'),
        ('maps', '0001_initial'),
        ('artifacts', '0002_auto_20150508_1532'),
        ('documents', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='artifacts',
            field=models.ManyToManyField(verbose_name='Artifacts related to this Document', blank=True, to='artifacts.Artifact'),
        ),
        migrations.AddField(
            model_name='document',
            name='audiovisuals',
            field=models.ManyToManyField(verbose_name='Media (slimbox)', blank=True, to='connections.Audiovisual'),
        ),
        migrations.AddField(
            model_name='document',
            name='biblio',
            field=models.ManyToManyField(verbose_name='Further Study (slimbox)', blank=True, to='connections.Biblio'),
        ),
        migrations.AddField(
            model_name='document',
            name='connections',
            field=models.ManyToManyField(verbose_name='PDFs (new tab)', blank=True, to='connections.Connection'),
        ),
        migrations.AddField(
            model_name='document',
            name='documents',
            field=models.ManyToManyField(verbose_name='Other Documents related to this Document', blank=True, to='documents.Document'),
        ),
        migrations.AddField(
            model_name='document',
            name='essays',
            field=models.ManyToManyField(verbose_name='Background Info (slimbox)', blank=True, to='connections.Essay'),
        ),
        migrations.AddField(
            model_name='document',
            name='lectures',
            field=models.ManyToManyField(verbose_name='Lectures (full page)', blank=True, to='scholars.Lecture'),
        ),
        migrations.AddField(
            model_name='document',
            name='maps',
            field=models.ManyToManyField(verbose_name='Maps (full page)', blank=True, to='maps.Geomap'),
        ),
        migrations.AddField(
            model_name='document',
            name='profiles',
            field=models.ManyToManyField(verbose_name='Choose creating Community Member(s)', blank=True, to='community.Profile'),
        ),
        migrations.AddField(
            model_name='document',
            name='resourcesets',
            field=models.ManyToManyField(verbose_name='Resource Sets to which this Document belongs', blank=True, to='resources.Resourceset'),
        ),
        migrations.AddField(
            model_name='document',
            name='weblinks',
            field=models.ManyToManyField(blank=True, to='connections.Weblink'),
        ),
        migrations.AlterField(
            model_name='document',
            name='author',
            field=models.CharField(max_length=64, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='document',
            name='bibid',
            field=models.CharField(max_length=32, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='document',
            name='description',
            field=models.TextField(verbose_name='Short Description', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='document',
            name='edited_by',
            field=models.CharField(max_length=64, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='document',
            name='filename',
            field=models.CharField(max_length=64, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='document',
            name='hist_context',
            field=models.TextField(verbose_name='Historic Context', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='document',
            name='narrative',
            field=models.TextField(verbose_name='About this..', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='document',
            name='notes',
            field=models.TextField(verbose_name='Production Notes', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='document',
            name='object_name',
            field=models.CharField(max_length=128, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='idea',
            name='idea_text',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='idea',
            name='name',
            field=models.CharField(verbose_name='Label', max_length=64, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='page',
            name='page_label',
            field=models.CharField(verbose_name='page label', max_length=64, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='page',
            name='page_suffix',
            field=models.CharField(verbose_name='filename suffix', max_length=64, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='page',
            name='transcript',
            field=models.TextField(verbose_name='Transcription', blank=True, default=''),
        ),
    ]
