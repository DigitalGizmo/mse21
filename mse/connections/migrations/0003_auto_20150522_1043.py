# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('connections', '0002_auto_20150514_1734'),
    ]

    operations = [
        migrations.AlterField(
            model_name='slide',
            name='credit_line',
            field=models.CharField(blank=True, max_length=128, default='', help_text='For each slide -- Slides ignore Credit Line at top of form.'),
        ),
    ]
