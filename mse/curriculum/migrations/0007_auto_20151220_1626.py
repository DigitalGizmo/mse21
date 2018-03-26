# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0006_supplement'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='supplement',
            options={'ordering': ['ordinal', 'sup_num']},
        ),
        migrations.AddField(
            model_name='gradelevel',
            name='ordinal',
            field=models.IntegerField(verbose_name='Order in Menu', default=99),
        ),
        migrations.AddField(
            model_name='subject',
            name='ordinal',
            field=models.IntegerField(verbose_name='Order in Menu', default=99),
        ),
    ]
