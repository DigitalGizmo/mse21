# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0009_auto_20151119_1609'),
        ('curriculum', '0008_auto_20160116_1428'),
        ('resources', '0005_resourceset_lessons'),
        ('artifacts', '0008_auto_20151119_1609'),
        ('scholars', '0004_auto_20151023_0933'),
        ('connections', '0007_auto_20171109_1548'),
        ('maps', '0007_auto_20151022_2133'),
        ('videos', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='artifacts',
            field=models.ManyToManyField(verbose_name='Artifacts related to this item', blank=True, to='artifacts.Artifact'),
        ),
        migrations.AddField(
            model_name='video',
            name='audiovisuals',
            field=models.ManyToManyField(verbose_name='Related Media (slimbox)', blank=True, to='connections.Audiovisual'),
        ),
        migrations.AddField(
            model_name='video',
            name='biblio',
            field=models.ManyToManyField(verbose_name='Further Study (slimbox)', blank=True, to='connections.Biblio'),
        ),
        migrations.AddField(
            model_name='video',
            name='connections',
            field=models.ManyToManyField(verbose_name='Related PDFs (new tab)', blank=True, to='connections.Connection'),
        ),
        migrations.AddField(
            model_name='video',
            name='documents',
            field=models.ManyToManyField(verbose_name='Documents related to this item', blank=True, to='documents.Document'),
        ),
        migrations.AddField(
            model_name='video',
            name='essays',
            field=models.ManyToManyField(verbose_name='Background Info (slimbox)', blank=True, to='connections.Essay'),
        ),
        migrations.AddField(
            model_name='video',
            name='lectures',
            field=models.ManyToManyField(verbose_name='Lectures (full page)', blank=True, to='scholars.Lecture'),
        ),
        migrations.AddField(
            model_name='video',
            name='lessons',
            field=models.ManyToManyField(verbose_name='Lesson PDFs (new tab)', blank=True, to='curriculum.Lesson'),
        ),
        migrations.AddField(
            model_name='video',
            name='maps',
            field=models.ManyToManyField(verbose_name='Maps (full page)', blank=True, to='maps.Geomap'),
        ),
        migrations.AddField(
            model_name='video',
            name='resourcesets',
            field=models.ManyToManyField(verbose_name='Choose Resource Sets this item belongs to', blank=True, to='resources.Resourceset'),
        ),
        migrations.AddField(
            model_name='video',
            name='weblinks',
            field=models.ManyToManyField(blank=True, to='connections.Weblink'),
        ),
        migrations.AlterField(
            model_name='video',
            name='video_source',
            field=models.CharField(verbose_name='source url', max_length=128, blank=True, default=''),
        ),
    ]
