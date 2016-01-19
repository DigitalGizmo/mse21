# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0008_scene'),
    ]

    operations = [
        migrations.CreateModel(
            name='Single',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('short_name', models.SlugField(max_length=32, unique=True)),
                ('title', models.CharField(max_length=128)),
                ('subtitle', models.CharField(blank=True, max_length=128, default='')),
                ('narrative', models.TextField(blank=True, default='')),
            ],
        ),
    ]
