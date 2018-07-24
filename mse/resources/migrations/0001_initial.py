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
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(blank=True, null=True, max_length=64, verbose_name='Label')),
                ('idea_text', models.TextField(blank=True, null=True)),
                ('idea_num', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Resourceset',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=128)),
                ('narrative', models.TextField(blank=True, null=True, verbose_name='Narrative')),
                ('notes', models.TextField(blank=True, null=True, verbose_name='Production Notes')),
                ('edited_by', models.CharField(blank=True, null=True, max_length=64)),
                ('edit_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='edit date')),
                ('status_num', models.IntegerField(default=0, choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')])),
                ('ordinal', models.IntegerField(default=999, verbose_name='Order in Menu')),
            ],
        ),
        migrations.AddField(
            model_name='idea',
            name='resourceset',
            field=models.ForeignKey(to='resources.Resourceset', on_delete=models.CASCADE),
        ),
    ]
