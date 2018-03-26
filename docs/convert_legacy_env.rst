Create new MSE environment locally
=================================
Preject existed as olc with Django 1.4, not in a virtual environment.

Create project directory::

	Sites/mse_project

* Move existing OLC inside it,
* Move .gitignore to project level

Create virt env::

	mkvirtualenv -a /Users/don/Sites/mse_project/mse --python=/usr/local/bin/python3.4 mse

in virt env::

	pip install Django==1.7.7
	pip install psycopg2==2.6
	pip install Unipath==1.1

* Remove Migrations dirs
* Update settings
	* Possible version 1.8 differences
		* TEMPLATES = [ ... DIRS[]
		* Installed apps: sites?
* create database::

	CREATE ROLE msedb_user WITH CREATEDB PASSWORD 'cwmorgan$1814';
	ALTER ROLE msedb_user WITH LOGIN PASSWORD 'dino$prints';
	ALTER ROLE msedb_user PASSWORD 'cwmorgan$1814';

Logout and log back in as user and create db::

	psql postgres mseb_user	
	CREATE DATABASE msedb;

Change all unicode refs to __str__

Migrations
-----------
Going to build up the directory app by app, view by view -- to avoid circular refs in many to manys

Make sure ownder of database and of public schema are both msedb_user::

	ALTER SCHEMA public OWNER to msedb_user;

	permission denied for relation django_migrations

Run grant script for msedb_user -- more portable than depending on superuser
::

	#!/bin/sh

	dbname="msedb"
	username="don"
	db_user="msedb_user"

	psql $dbname $username << EOF
		GRANT ALL ON ALL TABLES IN SCHEMA public to $db_user;
		GRANT ALL ON ALL SEQUENCES IN SCHEMA public to $db_user;
		GRANT ALL ON ALL FUNCTIONS IN SCHEMA public to $db_user;
	EOF

Succes on simple migrate.

Separate out the many to manys just in the models-- migrate all, then add many
For each, create clean dir::

	./manage.py startapp artifacts

* Copy full model from mse_full
* delete manys
* add app to settings
* makemigrations

Done
	* artifacts
	* (connections has no manys)
	* maps uses Sites
	* scholars has two many blocks

Convert from Char null=True to default='' in models.
::

	, null=True)
	, default='')

Remove ,null=True from manys

Import tables
~~~~~~~~~~~~~
(see Documents/Projects/MSE20/DataMigration/msedb_commands.rst for full collection)
::

	cd ~/Documents/Projects/MSE20/DataMigration/CSV

	psql postgres
	\connect msedb

	COPY community_profile (id,short_name,profile_name,institution,location,narrative,is_institution,notes,edited_by,edit_date,status_num,ordinal) FROM '/Users/don/Documents/Projects/MSE20/DataMigration/exports/profiles.csv' (FORMAT csv, FORCE_NOT_NULL(institution,location,narrative,notes,edited_by));

Characters to replace
::

	Ð	-	0xd0 0x20
	Õ	'	0xd5 0x73
	Ò	""	0xd2 0x57?
	Ó	""
	©	&copy;	0xa9

Use auto created Django command to reset sequence::

	./manage.py sqlsequencereset community

	SELECT setval(pg_get_serial_sequence('"community_profile"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "community_profile";

SQL Server sql output -- just for the associations --  this process doesn't catch bad characters.
[sql server - How to export all data from table to an insertable sql format? - Stack Overflow](http://stackoverflow.com/questions/20542819/how-to-export-all-data-from-table-to-an-insertable-sql-format)
Lose [ and ]. Add INTO, and ;
Run the sql
::

	cd ~/Documents/Projects/MSE20/DataMigration/SQL

	$ psql msedb -f many_maps_seq.sql

Turns out the id numbers for the manys are whacky and high, I'll renumber them. Within psql.
::

	ALTER SEQUENCE maps_geomap_artifacts_id_seq RESTART WITH 1;
	UPDATE maps_geomap_artifacts SET id = DEFAULT;

Didn't work. Leave ids out of import in the first place. Regualar expresson for getting rid of id:
::

	VALUES \((\d+), 
	VALUES (

Mistakenly ran mse2db update against msedb -- I think it messed up the sequence numbers. 
Rerun the sequence setting scripts - starting with documents.
On eApps as root
:: 

	cd /var/www/mseadmin/data/FTP_transfer/scripts
	./ many_documents_seq.sh

Hmm, did I import the sites tables? 
remove secret key
~~~~~~~~~~~~~~~~~
