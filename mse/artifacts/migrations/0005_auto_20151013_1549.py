# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('artifacts', '0004_artifact_subtitle'),
    ]

    operations = [
        migrations.AddField(
            model_name='artifact',
            name='initial_x',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='artifact',
            name='initial_y',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='artifact',
            name='initial_zoom',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='artifacts',
            field=models.ManyToManyField(verbose_name='Artifacts related to this item', blank=True, to='artifacts.Artifact'),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='audiovisuals',
            field=models.ManyToManyField(verbose_name='Related Media (slimbox)', blank=True, to='connections.Audiovisual'),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='connections',
            field=models.ManyToManyField(verbose_name='Related PDFs (new tab)', blank=True, to='connections.Connection'),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='documents',
            field=models.ManyToManyField(verbose_name='Documents related to this item', blank=True, to='documents.Document'),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='resourcesets',
            field=models.ManyToManyField(verbose_name='Choose Resource Sets this item belongs to', blank=True, to='resources.Resourceset'),
        ),
    ]
