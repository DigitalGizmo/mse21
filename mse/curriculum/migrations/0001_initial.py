# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0002_auto_20150514_1218'),
    ]

    operations = [
        migrations.CreateModel(
            name='Gradelevel',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=192)),
            ],
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=192)),
                ('description', models.TextField(verbose_name='Background Essay', blank=True, default='')),
                ('author', models.CharField(max_length=64, blank=True, default='')),
                ('gradelevels', models.ManyToManyField(to='curriculum.Gradelevel', verbose_name='Gradelevels related to this Lesson', blank=True)),
                ('profiles', models.ManyToManyField(to='community.Profile', verbose_name='Choose creating Community Member(s)', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=192)),
            ],
        ),
        migrations.AddField(
            model_name='lesson',
            name='subjects',
            field=models.ManyToManyField(to='curriculum.Subject', verbose_name='Subjects related to this Lesson', blank=True),
        ),
    ]
