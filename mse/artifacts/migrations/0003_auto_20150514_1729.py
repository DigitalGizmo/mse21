# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('artifacts', '0002_auto_20150508_1532'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artifact',
            name='assoc_place',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='credit_line',
            field=models.CharField(default='', blank=True, max_length=128),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='date_made',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='description',
            field=models.TextField(verbose_name='Short Description', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='edited_by',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='filename',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='id_number',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='maker',
            field=models.CharField(default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='materials',
            field=models.CharField(default='', blank=True, max_length=128),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='measurements',
            field=models.CharField(default='', blank=True, max_length=128),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='narrative',
            field=models.TextField(verbose_name='Narrative', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='notes',
            field=models.TextField(verbose_name='Production Notes', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='object_name',
            field=models.CharField(default='', blank=True, max_length=128),
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
            model_name='page',
            name='page_label',
            field=models.CharField(verbose_name='view label', default='', blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='page',
            name='page_suffix',
            field=models.CharField(verbose_name='filename suffix', default='', blank=True, max_length=64),
        ),
    ]
