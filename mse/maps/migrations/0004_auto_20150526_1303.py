# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0003_auto_20150515_1156'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comparevoyage',
            old_name='voyageID',
            new_name='voyage_id',
        ),
    ]
