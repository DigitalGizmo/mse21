# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0009_single'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='ordinal',
            field=models.IntegerField(verbose_name='Order in Menu', default=99),
        ),
    ]
