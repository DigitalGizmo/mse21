# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('connections', '0002_auto_20150514_1734'),
        ('maps', '0002_auto_20150515_1025'),
        ('scholars', '0001_initial'),
        ('community', '0002_auto_20150514_1218'),
        ('resources', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='resourceset',
            name='audiovisuals',
            field=models.ManyToManyField(to='connections.Audiovisual', blank=True, verbose_name='Media (slimbox)'),
        ),
        migrations.AddField(
            model_name='resourceset',
            name='biblio',
            field=models.ManyToManyField(to='connections.Biblio', blank=True, verbose_name='Further Study'),
        ),
        migrations.AddField(
            model_name='resourceset',
            name='connections',
            field=models.ManyToManyField(to='connections.Connection', blank=True, verbose_name='PDFs'),
        ),
        migrations.AddField(
            model_name='resourceset',
            name='essays',
            field=models.ManyToManyField(to='connections.Essay', blank=True, verbose_name='Background Info'),
        ),
        migrations.AddField(
            model_name='resourceset',
            name='lectures',
            field=models.ManyToManyField(to='scholars.Lecture', blank=True, verbose_name='Lectures (full page)'),
        ),
        migrations.AddField(
            model_name='resourceset',
            name='maps',
            field=models.ManyToManyField(to='maps.Geomap', blank=True, verbose_name='Maps (full page)'),
        ),
        migrations.AddField(
            model_name='resourceset',
            name='profiles',
            field=models.ManyToManyField(to='community.Profile', blank=True, verbose_name='Choose creating Community Member(s)'),
        ),
        migrations.AddField(
            model_name='resourceset',
            name='weblinks',
            field=models.ManyToManyField(to='connections.Weblink', blank=True),
        ),
        migrations.AlterField(
            model_name='idea',
            name='idea_text',
            field=models.TextField(default='', blank=True),
        ),
        migrations.AlterField(
            model_name='idea',
            name='name',
            field=models.CharField(default='', max_length=64, verbose_name='Label', blank=True),
        ),
        migrations.AlterField(
            model_name='resourceset',
            name='edited_by',
            field=models.CharField(default='', max_length=64, blank=True),
        ),
        migrations.AlterField(
            model_name='resourceset',
            name='narrative',
            field=models.TextField(default='', blank=True, verbose_name='Narrative'),
        ),
        migrations.AlterField(
            model_name='resourceset',
            name='notes',
            field=models.TextField(default='', blank=True, verbose_name='Production Notes'),
        ),
    ]
