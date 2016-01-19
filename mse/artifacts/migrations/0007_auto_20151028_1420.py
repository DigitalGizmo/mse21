# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('artifacts', '0006_auto_20151023_0930'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artifact',
            name='initial_x',
            field=models.IntegerField(verbose_name='X - Default (blank) is 0 (centered)', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='initial_y',
            field=models.IntegerField(verbose_name='Y - Default (blank) is 0 (centered)', blank=True, null=True),
        ),
    ]
