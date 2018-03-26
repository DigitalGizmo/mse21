# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0008_auto_20160116_1428'),
        ('resources', '0004_auto_20151022_2137'),
    ]

    operations = [
        migrations.AddField(
            model_name='resourceset',
            name='lessons',
            field=models.ManyToManyField(blank=True, verbose_name='Lesson PDFs (new tab)', to='curriculum.Lesson'),
        ),
    ]
