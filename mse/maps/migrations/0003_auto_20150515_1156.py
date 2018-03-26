# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0002_auto_20150515_1025'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chapter',
            name='chap_num',
            field=models.IntegerField(blank=True, verbose_name='Chapter Number', null=True),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='date',
            field=models.CharField(blank=True, max_length=16, help_text='year or year range', default='', verbose_name='Date'),
        ),
    ]
