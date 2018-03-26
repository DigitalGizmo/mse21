# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0002_auto_20151001_1627'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='description',
            field=models.TextField(verbose_name='Description', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='gradelevels',
            field=models.ManyToManyField(verbose_name='Grade-levels related to this Lesson', to='curriculum.Gradelevel', blank=True),
        ),
    ]
