# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sitewide', '0002_menu_has_icon'),
    ]

    operations = [
        migrations.CreateModel(
            name='Featured',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('short_name', models.CharField(max_length=32)),
                ('resource_type', models.CharField(max_length=32)),
                ('display_status', models.IntegerField(default=0, choices=[(0, '0 - not displayed'), (1, '1 - on list'), (2, '2 - one of three'), (3, '3 - banner')])),
                ('banner_blurb', models.CharField(max_length=255, default='', blank=True)),
                ('banner_name', models.CharField(max_length=32, default='', blank=True)),
            ],
        ),
    ]
