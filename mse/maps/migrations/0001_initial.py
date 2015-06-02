# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('chap_num', models.IntegerField(verbose_name='Chapter Number', null=True, blank=True)),
                ('latitude', models.FloatField(verbose_name='Latitude', null=True, blank=True)),
                ('longitude', models.FloatField(verbose_name='Longitude', null=True, blank=True)),
                ('zoom_level', models.IntegerField(default=3, verbose_name='Chapter Zoom Level', help_text='Same range as for initial zoom.')),
                ('location', models.CharField(verbose_name='Location', max_length=64, null=True, blank=True)),
                ('date', models.CharField(null=True, verbose_name='Date', max_length=16, help_text='year or year range', blank=True)),
                ('title', models.CharField(max_length=64, null=True, blank=True)),
                ('has_image', models.BooleanField(help_text='goes in: /sites/olc/maps/static/maps/chapics/shortname_chap# <br> large: /sites/olc/maps/static/maps/chaplarge/shortname_chap# ')),
                ('caption', models.CharField(null=True, verbose_name='Caption', max_length=255, help_text='Includes credits', blank=True)),
                ('narrative', models.TextField(verbose_name='Narrative', null=True, blank=True)),
            ],
            options={
                'verbose_name': 'Story map - Chapter',
            },
        ),
        migrations.CreateModel(
            name='Comparevoyage',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('label', models.CharField(verbose_name='nickname for this voyage', unique=True, max_length=32)),
                ('voyageID', models.IntegerField(default=0, verbose_name='voyage map ID', help_text='look for number in admin edit link for map in question')),
                ('ordinal', models.IntegerField(default=999, verbose_name='Order in Menu')),
                ('color', models.CharField(verbose_name='Line Color', max_length=16, null=True, blank=True)),
            ],
            options={
                'verbose_name': 'Compare map only - Voyage map IDs',
            },
        ),
        migrations.CreateModel(
            name='Geomap',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('short_name', models.CharField(unique=True, max_length=32)),
                ('title', models.CharField(max_length=128)),
                ('fusion_table_id', models.CharField(default='add id for fusion table', max_length=64, help_text='For Voyages and Compare (not Story). Currently supplied by Don')),
                ('map_type', models.CharField(default='Voyage', choices=[('Voyage', 'Voyage'), ('Story', 'Story'), ('Compare', 'Compare')], max_length=16)),
                ('init_lat', models.FloatField(verbose_name='Initial Latitude', null=True, help_text="Decimal degrees, South is negative. Right click on google maps - What's Here.", blank=True)),
                ('init_long', models.FloatField(verbose_name='Initial Longitude', null=True, help_text='Decimal degrees, West is negative', blank=True)),
                ('init_zoom', models.IntegerField(default=3, verbose_name='Initial Zoom Level', help_text='0= entire world, 3= most of hemisphere, 9 = area like Connecticut, 12= buildings')),
                ('date_range', models.CharField(null=True, max_length=64, help_text='For Voyages -- Shows under title in Compare navigation', blank=True)),
                ('description', models.CharField(null=True, max_length=64, help_text='For Voyages -- blurb following date range in Compare navigation', blank=True)),
                ('caption', models.CharField(null=True, max_length=128, help_text='For launch page image. Will preceed credit.', blank=True)),
                ('credit', models.CharField(null=True, max_length=128, help_text='For launch page image. Will follow caption.', blank=True)),
                ('narrative', models.TextField(verbose_name='About This Map', null=True, blank=True)),
                ('notes', models.TextField(verbose_name='Production Notes', null=True, blank=True)),
                ('edited_by', models.CharField(max_length=64, null=True, blank=True)),
                ('edit_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='edit date')),
                ('status_num', models.IntegerField(default=0, choices=[(1, '1 - Entered'), (2, '2 - TBD'), (3, '3 - Work in progress'), (4, '4 - Published')])),
                ('augmented', models.BooleanField()),
                ('log_link_type', models.IntegerField(default=0, choices=[(0, '0 - No links'), (1, '1 - Logbook MSE collections'), (2, '2 - slim journal pages')])),
                ('ordinal', models.IntegerField(default=999, verbose_name='Order in Menu')),
            ],
            options={
                'verbose_name': 'map',
            },
        ),
        migrations.CreateModel(
            name='Idea',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('name', models.CharField(verbose_name='Label', max_length=64, null=True, blank=True)),
                ('idea_text', models.TextField(null=True, blank=True)),
                ('idea_num', models.IntegerField(default=0)),
                ('geomap', models.ForeignKey(to='maps.Geomap')),
            ],
            options={
                'verbose_name': 'Ideas for Classroom Use',
            },
        ),
        migrations.CreateModel(
            name='Logyear',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('year', models.CharField(verbose_name='Voyage - Year', max_length=4, null=True, blank=True)),
                ('geomap', models.ForeignKey(to='maps.Geomap')),
            ],
            options={
                'verbose_name': 'Voyage map only - Logyear',
            },
        ),
        migrations.AddField(
            model_name='comparevoyage',
            name='geomap',
            field=models.ForeignKey(to='maps.Geomap'),
        ),
        migrations.AddField(
            model_name='chapter',
            name='geomap',
            field=models.ForeignKey(to='maps.Geomap'),
        ),
    ]
