# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=128)),
                ('short_name', models.CharField(max_length=32, unique=True)),
                ('bibid', models.CharField(max_length=32, blank=True, null=True)),
                ('filename', models.CharField(max_length=64, blank=True, null=True)),
                ('object_name', models.CharField(max_length=128, blank=True, null=True)),
                ('augmented', models.BooleanField()),
                ('description', models.TextField(verbose_name='Short Description', blank=True, null=True)),
                ('narrative', models.TextField(verbose_name='About this..', blank=True, null=True)),
                ('hist_context', models.TextField(verbose_name='Historic Context', blank=True, null=True)),
                ('author', models.CharField(max_length=64, blank=True, null=True)),
                ('date_made', models.CharField(max_length=64)),
                ('identifier', models.CharField(verbose_name='Locator', max_length=64)),
                ('ordinal', models.IntegerField(default=999, verbose_name='Order in Menu')),
                ('notes', models.TextField(verbose_name='Production Notes', blank=True, null=True)),
                ('edited_by', models.CharField(max_length=64, blank=True, null=True)),
                ('edit_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='date edited')),
                ('status_num', models.IntegerField(default=0, choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')])),
            ],
        ),
        migrations.CreateModel(
            name='Idea',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(verbose_name='Label', max_length=64, blank=True, null=True)),
                ('idea_text', models.TextField(blank=True, null=True)),
                ('idea_num', models.IntegerField(default=0)),
                ('document', models.ForeignKey(to='documents.Document', on_delete=models.CASCADE)),
            ],
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('page_suffix', models.CharField(verbose_name='filename suffix', max_length=64, blank=True, null=True)),
                ('page_label', models.CharField(verbose_name='page label', max_length=64, blank=True, null=True)),
                ('page_num', models.IntegerField(verbose_name='page order')),
                ('transcript', models.TextField(verbose_name='Transcription', blank=True, null=True)),
                ('document', models.ForeignKey(to='documents.Document', on_delete=models.CASCADE)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('question_text', models.CharField(max_length=255)),
                ('question_num', models.IntegerField(default=0)),
                ('document', models.ForeignKey(to='documents.Document', on_delete=models.CASCADE)),
            ],
        ),
    ]
