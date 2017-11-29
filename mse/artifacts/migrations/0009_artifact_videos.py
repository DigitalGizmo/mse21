# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0003_video_videos'),
        ('artifacts', '0008_auto_20151119_1609'),
    ]

    operations = [
        migrations.AddField(
            model_name='artifact',
            name='videos',
            field=models.ManyToManyField(verbose_name='Videos related to this item', blank=True, to='videos.Video'),
        ),
    ]
