# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=128)),
                ('description', models.TextField(blank=True, default='', verbose_name='Narrative')),
                ('details', models.TextField(blank=True, default='', verbose_name='Narrative')),
                ('start_date', models.DateTimeField(null=True, blank=True, verbose_name='start date or single')),
                ('on_home', models.BooleanField(default=False)),
                ('contact_email', models.CharField(blank=True, default='', max_length=64)),
                ('link_text', models.CharField(blank=True, default='', max_length=128)),
                ('link_url', models.CharField(blank=True, default='', max_length=128)),
                ('location', models.CharField(blank=True, default='', max_length=128)),
                ('cost', models.CharField(blank=True, default='', max_length=64)),
            ],
        ),
    ]
