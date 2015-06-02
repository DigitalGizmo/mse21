# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('connections', '0003_auto_20150522_1043'),
    ]

    operations = [
        migrations.AlterField(
            model_name='slide',
            name='narrative',
            field=models.TextField(blank=True, help_text='caption for each slide -- slides ignore Narrative at top of form.', default='', verbose_name='Caption'),
        ),
    ]
