# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Audiovisual',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=192)),
                ('credit_line', models.CharField(blank=True, null=True, max_length=128)),
                ('narrative', models.TextField(verbose_name='Narrative', blank=True, null=True)),
                ('media_type', models.CharField(default='image', choices=[('Image', 'Image'), ('Video', 'Video'), ('Audio', 'Audio'), ('Slideshow', 'Slideshow')], help_text='images go in olc/connections/static/connections/audiovisuals/images/, audio in ../audiovisuals/audio, etc.', max_length=16)),
            ],
            options={
                'verbose_name': 'Media',
            },
        ),
        migrations.CreateModel(
            name='Biblio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('title', models.CharField(max_length=128)),
                ('citation', models.CharField(blank=True, null=True, max_length=255)),
                ('biblio_type', models.CharField(default='source', choices=[('source', 'Source'), ('related_arts', 'Art, Film, Lit')], max_length=16)),
                ('description', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Further Study',
            },
        ),
        migrations.CreateModel(
            name='Connection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('link_text', models.CharField(max_length=128)),
                ('to_short_name', models.CharField(blank=True, null=True, max_length=32)),
                ('link_type', models.CharField(default='pdf', choices=[('pdf', 'pdf'), ('tbd', 'to be determined')], max_length=16)),
                ('link_heading', models.CharField(default='related', choices=[('related', 'Related Resources'), ('classroom', 'In the Classroom')], max_length=16)),
                ('edit_date', models.DateTimeField(verbose_name='date edited', default=datetime.datetime.now)),
            ],
            options={
                'verbose_name': 'PDF',
            },
        ),
        migrations.CreateModel(
            name='Essay',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=192)),
                ('narrative', models.TextField(verbose_name='Background Essay', blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Background Info',
            },
        ),
        migrations.CreateModel(
            name='Moreinfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=192)),
                ('has_image', models.BooleanField()),
                ('credit_line', models.CharField(blank=True, null=True, max_length=128)),
                ('narrative', models.TextField(verbose_name='Narrative', blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Slide',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('slide_num', models.IntegerField(help_text='File naming: olc/connections/static/connections/audiovisuals/slides/short_name_1, short_name_2, etc.')),
                ('credit_line', models.CharField(blank=True, null=True, help_text='For each slide -- Slides ignore Credit Line at top of form.', max_length=128)),
                ('narrative', models.TextField(verbose_name='Caption', blank=True, help_text='caption for each slide -- slides ignore Narrative at top of form.', null=True)),
                ('audiovisual', models.ForeignKey(to='connections.Audiovisual', on_delete=models.CASCADE)),
            ],
            options={
                'verbose_name': 'Slides - only for Slideshow',
            },
        ),
        migrations.CreateModel(
            name='Weblink',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('link_text', models.CharField(max_length=128)),
                ('link_url', models.CharField(blank=True, null=True, max_length=128)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
