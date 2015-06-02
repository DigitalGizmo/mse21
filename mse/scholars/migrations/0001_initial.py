# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Idea',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('name', models.CharField(null=True, blank=True, verbose_name='Label', max_length=64)),
                ('idea_text', models.TextField(null=True, blank=True)),
                ('idea_num', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Interview',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('scholar', models.CharField(null=True, blank=True, verbose_name='Scholars full name', max_length=128)),
                ('scholar_short_name', models.CharField(blank=True, max_length=32, null=True)),
                ('full_length', models.CharField(null=True, blank=True, verbose_name='Full video length', max_length=16)),
                ('narrative', models.TextField(blank=True, verbose_name='About this...', null=True)),
                ('ordinal', models.IntegerField(default=999, verbose_name='Order in Menu')),
                ('notes', models.TextField(blank=True, verbose_name='Production Notes', null=True)),
                ('edited_by', models.CharField(blank=True, max_length=64, null=True)),
                ('edit_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='edit date')),
                ('status_num', models.IntegerField(default=0, choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')])),
            ],
        ),
        migrations.CreateModel(
            name='Lecture',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=128)),
                ('scholar', models.CharField(null=True, blank=True, verbose_name='Scholars full name', max_length=128)),
                ('scholar_short_name', models.CharField(blank=True, max_length=32, null=True)),
                ('narrative', models.TextField(blank=True, verbose_name='About this...', null=True)),
                ('notes', models.TextField(blank=True, verbose_name='Production Notes', null=True)),
                ('edited_by', models.CharField(blank=True, max_length=64, null=True)),
                ('edit_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='edit date')),
                ('status_num', models.IntegerField(default=0, choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')])),
                ('ordinal', models.IntegerField(default=999, verbose_name='Order in Menu')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('title', models.CharField(max_length=128)),
                ('question_text', models.CharField(blank=True, max_length=255, null=True)),
                ('question_num', models.IntegerField(default=0)),
                ('length', models.CharField(blank=True, max_length=16, null=True)),
                ('interview', models.ForeignKey(to='scholars.Interview')),
            ],
            options={
                'ordering': ['question_num'],
            },
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('topic_num', models.IntegerField(default=0)),
                ('title', models.CharField(max_length=128)),
                ('transcript', models.TextField(blank=True, verbose_name='Transcription', null=True)),
                ('caption', models.TextField(blank=True, verbose_name='Caption', null=True)),
                ('lecture', models.ForeignKey(to='scholars.Lecture')),
            ],
            options={
                'ordering': ['topic_num'],
            },
        ),
        migrations.AddField(
            model_name='idea',
            name='lecture',
            field=models.ForeignKey(to='scholars.Lecture'),
        ),
    ]
