# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('connections', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audiovisual',
            name='credit_line',
            field=models.CharField(max_length=128, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='audiovisual',
            name='narrative',
            field=models.TextField(blank=True, verbose_name='Narrative', default=''),
        ),
        migrations.AlterField(
            model_name='biblio',
            name='citation',
            field=models.CharField(max_length=255, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='biblio',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='connection',
            name='to_short_name',
            field=models.CharField(max_length=32, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='essay',
            name='narrative',
            field=models.TextField(blank=True, verbose_name='Background Essay', default=''),
        ),
        migrations.AlterField(
            model_name='moreinfo',
            name='credit_line',
            field=models.CharField(max_length=128, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='moreinfo',
            name='narrative',
            field=models.TextField(blank=True, verbose_name='Narrative', default=''),
        ),
        migrations.AlterField(
            model_name='weblink',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='weblink',
            name='link_url',
            field=models.CharField(max_length=128, blank=True, default=''),
        ),
    ]
