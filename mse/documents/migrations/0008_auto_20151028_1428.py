# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0007_auto_20151028_1420'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='initial_y',
            field=models.IntegerField(default=1, verbose_name='Y - Default is 1 (top of page)', blank=True, null=True),
        ),
    ]
