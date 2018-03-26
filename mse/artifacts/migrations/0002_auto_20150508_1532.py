# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0001_initial'),
        ('community', '0001_initial'),
        ('scholars', '0001_initial'),
        ('connections', '0001_initial'),
        ('maps', '0001_initial'),
        ('documents', '0001_initial'),
        ('artifacts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='artifact',
            name='artifacts',
            field=models.ManyToManyField(blank=True, verbose_name='Other Artifacts related to this Artifact', to='artifacts.Artifact'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='audiovisuals',
            field=models.ManyToManyField(blank=True, verbose_name='Media (slimbox)', to='connections.Audiovisual'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='biblio',
            field=models.ManyToManyField(blank=True, verbose_name='Further Study (slimbox)', to='connections.Biblio'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='connections',
            field=models.ManyToManyField(blank=True, verbose_name='PDFs (new tab)', to='connections.Connection'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='documents',
            field=models.ManyToManyField(blank=True, verbose_name='Documents related to this Artifact', to='documents.Document'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='essays',
            field=models.ManyToManyField(blank=True, verbose_name='Background Info (slimbox)', to='connections.Essay'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='lectures',
            field=models.ManyToManyField(blank=True, verbose_name='Lectures (full page)', to='scholars.Lecture'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='maps',
            field=models.ManyToManyField(blank=True, verbose_name='Maps (full page)', to='maps.Geomap'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='profiles',
            field=models.ManyToManyField(blank=True, verbose_name='Choose creating Community Member(s)', to='community.Profile'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='resourcesets',
            field=models.ManyToManyField(blank=True, verbose_name='Choose Resource Sets this Artifact belongs to', to='resources.Resourceset'),
        ),
        migrations.AddField(
            model_name='artifact',
            name='weblinks',
            field=models.ManyToManyField(blank=True, to='connections.Weblink'),
        ),
    ]
