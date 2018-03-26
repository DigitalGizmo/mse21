# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('profile_name', models.CharField(max_length=128)),
                ('institution', models.CharField(null=True, blank=True, max_length=128)),
                ('location', models.CharField(null=True, blank=True, max_length=128)),
                ('narrative', models.TextField(null=True, blank=True, verbose_name='Narrative')),
                ('is_institution', models.BooleanField()),
                ('ordinal', models.IntegerField(default=999, verbose_name='Order in Menu')),
                ('notes', models.TextField(null=True, blank=True, verbose_name='Production Notes')),
                ('edited_by', models.CharField(null=True, blank=True, max_length=64)),
                ('edit_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='edit date')),
                ('status_num', models.IntegerField(default=0, choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')])),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=128)),
                ('narrative', models.TextField(null=True, blank=True, verbose_name='Narrative')),
                ('notes', models.TextField(null=True, blank=True, verbose_name='Production Notes')),
                ('ordinal', models.IntegerField(default=999, verbose_name='Order in Menu')),
                ('edited_by', models.CharField(null=True, blank=True, max_length=64)),
                ('edit_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='edit date')),
                ('status_num', models.IntegerField(default=0, choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')])),
            ],
            options={
                'verbose_name': 'Classroom Project',
            },
        ),
    ]
