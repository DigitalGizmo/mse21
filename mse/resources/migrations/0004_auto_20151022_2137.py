# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0003_resourceset_subtitle'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resourceset',
            name='narrative',
            field=models.TextField(verbose_name='About this...', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='resourceset',
            name='ordinal',
            field=models.IntegerField(verbose_name='Order in Menu', default=99),
        ),
    ]
