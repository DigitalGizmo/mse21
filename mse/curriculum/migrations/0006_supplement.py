# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0005_auto_20151119_1609'),
    ]

    operations = [
        migrations.CreateModel(
            name='Supplement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=192)),
                ('sup_num', models.IntegerField()),
                ('ordinal', models.IntegerField(verbose_name='Order in Menu', default=99)),
                ('lesson', models.ForeignKey(to='curriculum.Lesson')),
            ],
        ),
    ]
