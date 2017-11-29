# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0003_video_videos'),
        ('scholars', '0004_auto_20151023_0933'),
    ]

    operations = [
        migrations.AddField(
            model_name='lecture',
            name='videos',
            field=models.ManyToManyField(verbose_name='Videos related to this item', blank=True, to='videos.Video'),
        ),
    ]
