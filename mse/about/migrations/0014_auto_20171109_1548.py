# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0013_auto_20171109_1422'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='contact_text',
            field=models.TextField(verbose_name='Open text (ignore the other fields)', blank=True, default=''),
        ),
    ]
