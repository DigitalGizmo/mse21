# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2017-12-12 20:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Voyage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('voyageid', models.CharField(max_length=32)),
                ('lat', models.FloatField()),
                ('lon', models.FloatField()),
                ('day', models.IntegerField()),
                ('month', models.IntegerField()),
                ('year', models.IntegerField()),
            ],
        ),
    ]
