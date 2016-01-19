# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sitewide', '0005_auto_20151023_0930'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='featured',
            name='resource_type',
        ),
        migrations.AddField(
            model_name='featured',
            name='resource_locator',
            field=models.CharField(default='artifacts:artifact', max_length=32, choices=[('artifacts:artifact', 'artifact'), ('documents:document', 'document'), ('maps:geomap', 'map'), ('scholars:lecture', 'lecture'), ('scholars:interview', 'interview'), ('resources:resourceset', 'resource set'), ('community:profile', 'profile'), ('community:project', 'classroom project'), ('nolink', 'item not linked')]),
            preserve_default=False,
        ),
    ]
