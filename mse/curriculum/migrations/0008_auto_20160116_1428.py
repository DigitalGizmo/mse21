# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0007_auto_20151220_1626'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='gradelevel',
            options={'ordering': ['ordinal']},
        ),
        migrations.AlterModelOptions(
            name='subject',
            options={'ordering': ['ordinal']},
        ),
    ]
