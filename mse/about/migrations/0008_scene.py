# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0007_auto_20151123_1111'),
    ]

    operations = [
        migrations.CreateModel(
            name='Scene',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('short_name', models.SlugField(max_length=32, unique=True)),
                ('title', models.CharField(max_length=128)),
                ('subtitle', models.CharField(max_length=128, default='', blank=True)),
                ('narrative', models.TextField(default='', blank=True)),
                ('posted', models.DateField(verbose_name='Date posted', null=True, blank=True)),
                ('is_active', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['posted'],
            },
        ),
    ]
