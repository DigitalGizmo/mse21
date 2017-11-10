# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0012_event_contact_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='contact_text',
            field=models.TextField(verbose_name='Open text (ignore following fields)', blank=True, default=''),
        ),
    ]
