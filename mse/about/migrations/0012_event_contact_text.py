# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0011_event_on_menu'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='contact_text',
            field=models.CharField(max_length=255, blank=True, default=''),
        ),
    ]
