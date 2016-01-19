# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sitewide', '0003_featured'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='featured',
            options={'ordering': ['-display_status', 'ordinal']},
        ),
        migrations.AddField(
            model_name='featured',
            name='ordinal',
            field=models.IntegerField(default=99, verbose_name='Order in list'),
        ),
        migrations.AlterField(
            model_name='featured',
            name='resource_type',
            field=models.CharField(choices=[('artifact', 'artifact'), ('document', 'document'), ('map', 'map'), ('lecture', 'lecture'), ('interview', 'interview'), ('set', 'resource set'), ('banner', 'banner')], max_length=32),
        ),
    ]
