# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0002_auto_20150514_1621'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='page',
            options={'ordering': ['page_num']},
        ),
        migrations.AddField(
            model_name='document',
            name='read_by',
            field=models.CharField(blank=True, max_length=64, default=''),
        ),
    ]
