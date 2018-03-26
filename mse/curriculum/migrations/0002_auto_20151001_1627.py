# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gradelevel',
            name='short_name',
            field=models.SlugField(unique=True, max_length=32),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='short_name',
            field=models.SlugField(unique=True, max_length=32),
        ),
        migrations.AlterField(
            model_name='subject',
            name='short_name',
            field=models.SlugField(unique=True, max_length=32),
        ),
    ]
