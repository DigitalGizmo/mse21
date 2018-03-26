# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0003_video_videos'),
        ('maps', '0007_auto_20151022_2133'),
    ]

    operations = [
        migrations.AddField(
            model_name='geomap',
            name='videos',
            field=models.ManyToManyField(verbose_name='Videos related to this item', blank=True, to='videos.Video'),
        ),
    ]
