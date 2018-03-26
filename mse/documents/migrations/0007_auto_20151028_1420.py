# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0006_auto_20151023_0931'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='initial_x',
            field=models.IntegerField(verbose_name='X - Default (blank) is 0 (centered)', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='initial_y',
            field=models.IntegerField(verbose_name='Y - Default is 1 (top of page)', blank=True, null=True),
        ),
    ]
