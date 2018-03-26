# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('artifacts', '0003_auto_20150514_1729'),
    ]

    operations = [
        migrations.AddField(
            model_name='artifact',
            name='subtitle',
            field=models.CharField(max_length=128, blank=True, default=''),
        ),
    ]
