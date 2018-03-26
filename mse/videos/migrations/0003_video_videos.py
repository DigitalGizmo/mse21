# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0002_auto_20171127_1445'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='videos',
            field=models.ManyToManyField(verbose_name='Videos related to this item', blank=True, to='videos.Video'),
        ),
    ]
