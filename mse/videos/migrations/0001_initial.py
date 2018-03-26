# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('short_name', models.CharField(max_length=32, unique=True)),
                ('narrative', models.TextField(verbose_name='About this...', blank=True, default='')),
                ('ordinal', models.IntegerField(verbose_name='Order in Menu', default=99)),
                ('notes', models.TextField(verbose_name='Production Notes', blank=True, default='')),
                ('edited_by', models.CharField(max_length=64, blank=True, default='')),
                ('edit_date', models.DateTimeField(verbose_name='edit date', default=datetime.datetime.now)),
                ('status_num', models.IntegerField(default=0, choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')])),
                ('title', models.CharField(max_length=128)),
                ('producer', models.CharField(verbose_name='Producer/Owner', max_length=128, blank=True, default='')),
                ('video_source', models.CharField(max_length=128, blank=True, default='')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
