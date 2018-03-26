# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sitewide', '0007_menu_main_nav_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='featured',
            name='resource_locator',
            field=models.CharField(max_length=32, choices=[('artifacts:artifact', 'artifact'), ('community:project', 'classroom project'), ('documents:document', 'document'), ('about:event', 'event'), ('scholars:interview', 'interview'), ('scholars:lecture', 'lecture'), ('curriculum:lesson', 'lesson'), ('maps:geomap', 'map'), ('community:profile', 'profile'), ('resources:resourceset', 'resource set'), ('nolink', 'item not linked')]),
        ),
    ]
