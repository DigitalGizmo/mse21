# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0003_auto_20151002_1013'),
        ('scholars', '0003_lecture_subtitle'),
    ]

    operations = [
        migrations.AddField(
            model_name='lecture',
            name='lessons',
            field=models.ManyToManyField(verbose_name='Lesson PDFs (new tab)', to='curriculum.Lesson', blank=True),
        ),
        migrations.AlterField(
            model_name='interview',
            name='ordinal',
            field=models.IntegerField(default=99, verbose_name='Order in Menu'),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='artifacts',
            field=models.ManyToManyField(verbose_name='Artifacts related to this item', to='artifacts.Artifact', blank=True),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='audiovisuals',
            field=models.ManyToManyField(verbose_name='Related Media (slimbox)', to='connections.Audiovisual', blank=True),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='biblio',
            field=models.ManyToManyField(verbose_name='Further Study (slimbox)', to='connections.Biblio', blank=True),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='connections',
            field=models.ManyToManyField(verbose_name='Related PDFs (new tab)', to='connections.Connection', blank=True),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='documents',
            field=models.ManyToManyField(verbose_name='Documents related to this item', to='documents.Document', blank=True),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='essays',
            field=models.ManyToManyField(verbose_name='Background Info (slimbox)', to='connections.Essay', blank=True),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='lectures',
            field=models.ManyToManyField(verbose_name='Lectures (full page)', to='scholars.Lecture', blank=True),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='ordinal',
            field=models.IntegerField(default=99, verbose_name='Order in Menu'),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='resourcesets',
            field=models.ManyToManyField(verbose_name='Choose Resource Sets this item belongs to', to='resources.Resourceset', blank=True),
        ),
    ]
