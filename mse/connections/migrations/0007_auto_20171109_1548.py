# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('connections', '0006_auto_20171109_1415'),
    ]

    operations = [
        migrations.AlterField(
            model_name='biblio',
            name='citation',
            field=models.TextField(blank=True, default=''),
        ),
    ]
