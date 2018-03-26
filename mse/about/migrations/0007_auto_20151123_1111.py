# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0006_auto_20151118_1218'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='event',
            options={'ordering': ['start_date']},
        ),
        migrations.RemoveField(
            model_name='event',
            name='end_time',
        ),
        migrations.RemoveField(
            model_name='event',
            name='link_text',
        ),
        migrations.RemoveField(
            model_name='event',
            name='link_url',
        ),
        migrations.RemoveField(
            model_name='event',
            name='start_time',
        ),
        migrations.AddField(
            model_name='event',
            name='contact_name',
            field=models.CharField(max_length=32, default='', blank=True),
        ),
        migrations.AddField(
            model_name='event',
            name='contact_phone',
            field=models.CharField(max_length=32, default='', blank=True),
        ),
    ]
