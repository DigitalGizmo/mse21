# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0008_auto_20151028_1428'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='initial_zoom',
            field=models.IntegerField(blank=True, verbose_name='Initial zoom - Default (blank) is 50 (%)', null=True),
        ),
    ]
