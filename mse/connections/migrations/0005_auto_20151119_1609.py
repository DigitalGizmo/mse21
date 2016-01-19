# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('connections', '0004_auto_20150522_1044'),
    ]

    operations = [
        migrations.AlterField(
            model_name='connection',
            name='link_heading',
            field=models.CharField(choices=[('worksheet', 'Worksheet'), ('visual', 'Visual'), ('related', 'Related Resources'), ('classroom', 'In the Classroom')], default='related', max_length=16),
        ),
    ]
