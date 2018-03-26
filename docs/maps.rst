Map Documentation
==================

Version 1 Fusion-based maps
-------------------

* The Fusion Table API key is under dbutton@digitalgizmo.com
[Credentials - Mystic Maps](https://console.developers.google.com/project/superb-cubist-639/apiui/credential)

* But the Fusion Tables are actually in Don's personal account: don.b.button@gmail.com.

* The plan is to move all map data into the site's local PostgreSQL database

Map Process
------------

Excel
 - check date format: Format > Cells -- 3/14/1841
 
Export Excel as CSV with column headings

Excel exported hundreds of extra cols, so I used Numbers

Create new Fusion table
	- In fusuion table:
	- File > Share, Anyone with link
	- File > About this table
		- copy Id to enter into admin
		- 1aCXFIiwU1eofMOFe9DaPVg7QrKiqU7gcBmRxTDjT
		- FrancisAllen


Version 2 Internalization
================

2nd database
--------------

Have to migrate separately
::
	$ ./manage.py migrate  [uses default]
	$ ./manage.py migrate --database=msemap_db

Be aware that terminal readout will display all tables for each migration/ makemigration 
-- but most of the tables are actually skipped by the router rules in place


2nd database installation
--------------------------
Django docs: [Multiple databases | Django documentation | Django](https://docs.djangoproject.com/en/1.11/topics/db/multi-db/)
How to, Simple: [How to Configure Multiple Databases in Django the Simple Way](https://strongarm.io/blog/multiple-databases-in-django/)

routers.py is in mse/mse
Identified in mse/mse/settings/base.py::
	DATABASE_ROUTERS = ['mse.routers.MapdataRouter',]

The app mapdata is set up to always use that 2nd database.
