# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0010_event_ordinal'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='on_menu',
            field=models.BooleanField(default=True),
        ),
    ]
