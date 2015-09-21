# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Menu',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('short_name', models.CharField(max_length=32, unique=True)),
                ('title', models.CharField(max_length=128)),
                ('menu_blurb', models.TextField(default='', blank=True, verbose_name='Narrative')),
            ],
        ),
    ]
