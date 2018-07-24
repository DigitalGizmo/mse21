# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Artifact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('id_number', models.CharField(max_length=64, blank=True, null=True)),
                ('filename', models.CharField(max_length=64, blank=True, null=True)),
                ('short_name', models.CharField(max_length=32, unique=True)),
                ('title', models.CharField(max_length=128)),
                ('object_name', models.CharField(max_length=128, blank=True, null=True)),
                ('maker', models.CharField(max_length=64, blank=True, null=True)),
                ('assoc_place', models.CharField(max_length=64, blank=True, null=True)),
                ('date_made', models.CharField(max_length=64, blank=True, null=True)),
                ('materials', models.CharField(max_length=128, blank=True, null=True)),
                ('measurements', models.CharField(max_length=128, blank=True, null=True)),
                ('description', models.TextField(verbose_name='Short Description', blank=True, null=True)),
                ('narrative', models.TextField(verbose_name='Narrative', blank=True, null=True)),
                ('credit_line', models.CharField(max_length=128, blank=True, null=True)),
                ('is_vertical', models.BooleanField()),
                ('ordinal', models.IntegerField(verbose_name='Order in Menu', default=99)),
                ('notes', models.TextField(verbose_name='Production Notes', blank=True, null=True)),
                ('edited_by', models.CharField(max_length=64, blank=True, null=True)),
                ('edit_date', models.DateTimeField(verbose_name='edit date', default=datetime.datetime.now)),
                ('status_num', models.IntegerField(choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')], default=0)),
                ('augmented', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Idea',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(verbose_name='Label', max_length=64, blank=True, null=True)),
                ('idea_text', models.TextField(blank=True, null=True)),
                ('idea_num', models.IntegerField(default=0)),
                ('artifact', models.ForeignKey(to='artifacts.Artifact', on_delete=models.CASCADE)),
            ],
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('page_suffix', models.CharField(verbose_name='filename suffix', max_length=64, blank=True, null=True)),
                ('page_label', models.CharField(verbose_name='view label', max_length=64, blank=True, null=True)),
                ('page_num', models.IntegerField(verbose_name='view order')),
                ('artifact', models.ForeignKey(to='artifacts.Artifact', on_delete=models.CASCADE)),
            ],
            options={
                'verbose_name': 'View',
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('question_text', models.CharField(max_length=255)),
                ('question_num', models.IntegerField()),
                ('artifact', models.ForeignKey(to='artifacts.Artifact', on_delete=models.CASCADE)),
            ],
        ),
    ]
