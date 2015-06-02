# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0002_auto_20150515_1025'),
        ('sites', '0001_initial'),
        ('documents', '0002_auto_20150514_1621'),
        ('resources', '0002_auto_20150515_1029'),
        ('community', '0002_auto_20150514_1218'),
        ('artifacts', '0003_auto_20150514_1729'),
        ('connections', '0002_auto_20150514_1734'),
        ('scholars', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='interview',
            name='profiles',
            field=models.ManyToManyField(blank=True, verbose_name='Choose creating Community Member(s)', to='community.Profile'),
        ),
        migrations.AddField(
            model_name='interview',
            name='resourcesets',
            field=models.ManyToManyField(blank=True, verbose_name='Choose Resource Sets this Interview belongs to', to='resources.Resourceset'),
        ),
        migrations.AddField(
            model_name='interview',
            name='sites',
            field=models.ManyToManyField(help_text='All lectures appear in MSE -- only need to move Pequot over here for those desired in Pequot<br>', to='sites.Site'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='artifacts',
            field=models.ManyToManyField(blank=True, verbose_name='Artifacts related to this Lecture', to='artifacts.Artifact'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='audiovisuals',
            field=models.ManyToManyField(blank=True, verbose_name='Media (slimbox)', to='connections.Audiovisual'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='biblio',
            field=models.ManyToManyField(blank=True, verbose_name='Further Study', to='connections.Biblio'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='connections',
            field=models.ManyToManyField(blank=True, verbose_name='PDFs - Classroom only. (new tab)', to='connections.Connection'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='documents',
            field=models.ManyToManyField(blank=True, verbose_name='Documents related to this Lecture', to='documents.Document'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='essays',
            field=models.ManyToManyField(blank=True, verbose_name='Background Info', to='connections.Essay'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='interviews',
            field=models.ManyToManyField(blank=True, verbose_name='Interviews related to this  Lecture', to='scholars.Interview'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='lectures',
            field=models.ManyToManyField(blank=True, verbose_name='Other Lectures related to this one', to='scholars.Lecture'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='maps',
            field=models.ManyToManyField(blank=True, verbose_name='Maps (full page)', to='maps.Geomap'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='resourcesets',
            field=models.ManyToManyField(blank=True, verbose_name='Choose Resource Sets this Lecture belongs to', to='resources.Resourceset'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='sites',
            field=models.ManyToManyField(help_text='All lectures appear in MSE -- only need to move Pequot over here for those desired in Pequot<br>', to='sites.Site'),
        ),
        migrations.AddField(
            model_name='lecture',
            name='weblinks',
            field=models.ManyToManyField(blank=True, to='connections.Weblink'),
        ),
        migrations.AlterField(
            model_name='idea',
            name='idea_text',
            field=models.TextField(default='', blank=True),
        ),
        migrations.AlterField(
            model_name='idea',
            name='name',
            field=models.CharField(default='', blank=True, max_length=64, verbose_name='Label'),
        ),
        migrations.AlterField(
            model_name='interview',
            name='edited_by',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='interview',
            name='full_length',
            field=models.CharField(default='', blank=True, max_length=16, verbose_name='Full video length'),
        ),
        migrations.AlterField(
            model_name='interview',
            name='narrative',
            field=models.TextField(default='', blank=True, verbose_name='About this...'),
        ),
        migrations.AlterField(
            model_name='interview',
            name='notes',
            field=models.TextField(default='', blank=True, verbose_name='Production Notes'),
        ),
        migrations.AlterField(
            model_name='interview',
            name='scholar',
            field=models.CharField(default='', blank=True, max_length=128, verbose_name='Scholars full name'),
        ),
        migrations.AlterField(
            model_name='interview',
            name='scholar_short_name',
            field=models.CharField(default='', blank=True, max_length=32),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='edited_by',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='narrative',
            field=models.TextField(default='', blank=True, verbose_name='About this...'),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='notes',
            field=models.TextField(default='', blank=True, verbose_name='Production Notes'),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='scholar',
            field=models.CharField(default='', blank=True, max_length=128, verbose_name='Scholars full name'),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='scholar_short_name',
            field=models.CharField(default='', blank=True, max_length=32),
        ),
        migrations.AlterField(
            model_name='question',
            name='length',
            field=models.CharField(default='', blank=True, max_length=16),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_text',
            field=models.CharField(default='', blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='topic',
            name='caption',
            field=models.TextField(default='', blank=True, verbose_name='Caption'),
        ),
        migrations.AlterField(
            model_name='topic',
            name='transcript',
            field=models.TextField(default='', blank=True, verbose_name='Transcription'),
        ),
    ]
