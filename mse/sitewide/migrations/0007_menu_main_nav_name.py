# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sitewide', '0006_auto_20151104_1240'),
    ]

    operations = [
        migrations.AddField(
            model_name='menu',
            name='main_nav_name',
            field=models.CharField(max_length=32, blank=True, default=''),
        ),
    ]
