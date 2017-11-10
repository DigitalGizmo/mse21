# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('connections', '0005_auto_20151119_1609'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='slide',
            options={'verbose_name': 'Slides - only for Slideshow', 'ordering': ['slide_num']},
        ),
    ]
