# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0004_document_subtitle'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='initial_x',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='document',
            name='initial_y',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='document',
            name='initial_zoom',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='artifacts',
            field=models.ManyToManyField(verbose_name='Artifacts related to this item', to='artifacts.Artifact', blank=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='audiovisuals',
            field=models.ManyToManyField(verbose_name='Related Media (slimbox)', to='connections.Audiovisual', blank=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='connections',
            field=models.ManyToManyField(verbose_name='Related PDFs (new tab)', to='connections.Connection', blank=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='documents',
            field=models.ManyToManyField(verbose_name='Documents related to this item', to='documents.Document', blank=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='edit_date',
            field=models.DateTimeField(verbose_name='edit date', default=datetime.datetime.now),
        ),
        migrations.AlterField(
            model_name='document',
            name='narrative',
            field=models.TextField(verbose_name='Narrative', default='', blank=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='ordinal',
            field=models.IntegerField(verbose_name='Order in Menu', default=99),
        ),
        migrations.AlterField(
            model_name='document',
            name='resourcesets',
            field=models.ManyToManyField(verbose_name='Choose Resource Sets this item belongs to', to='resources.Resourceset', blank=True),
        ),
    ]
