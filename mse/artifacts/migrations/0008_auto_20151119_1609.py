# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('artifacts', '0007_auto_20151028_1420'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artifact',
            name='initial_zoom',
            field=models.IntegerField(blank=True, verbose_name='Initial zoom - Default (blank) is 50 (%)', null=True),
        ),
    ]
