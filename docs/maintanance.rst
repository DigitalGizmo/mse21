Maintanance
============

As of February 2016 the active 
Development elements:
	directory: msedev.mysticseaport.org 
	env:  mse -- mse2 is a duplicate - wsgi uses mse
	branch: develop
	settings: mse/settings/staging
	database: mse2db
	static: mse_static

Public, live
	dir: educators.mysticseaport.org
	env: mse_ed
	branch: develop
	static: mse_static

Local, Don's machine
	env: mse 
	database: mse2_db

GIT
	Use git logged in as mseadmin

Maps
	Currently handled through Google Fusion Tables
	Keys managed in Don's digitalgizmo account via: https://console.developers.google.com/project

	Actual fusion table maps are under Don's don.b.button@gmail.com account. In Drive.

	Process:
	- groom in Excel (normalize column names)
	- open in Numbers and export to CSV
	- create new Fusion table in Drive
	- Tools > Publish - Anyone with link
	- File > About this table - get ID

Transition to MSE 2.0
----------------

Collect static 
~~~~~~~~~~~~~~~~

Static directory
	mse1_static is outside of educators and msedev -- initially shared by both

Batch file is at /usr/local/bin
Executed by msedev.mysticseaport.org/management/collect
Since Apache is executing this, the ownership of mse/static is apache:apache

Renew WSGI for code change
~~~~~~~~~~~~~~~~~~~~~~~
::

	touch /var/www/mseadmin/data/www/educators.mysticseaport.org/mse/mse/wsgi.py
	touch /var/www/mseadmin/data/www/msedev.mysticseaport.org/mse/mse/wsgi.py
	touch /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/mse/wsgi.py


Database 
-----------------------------------

Tools
~~~~~~~~~
phpPgAdmin
http://68.169.52.41/phppgadmin/
user: postgres
Pass: in 1pass, keychain


Process for database changes
~~~~~~~~~~~~~~~~~~~~~
* makemigrations and test the change locally
* migrations stay in source control
* update remote git and run migrate there. (not makemigrations -- already there)
::

	./manage.py
	(then)
	migrate
	setmse (atext) expands to 
	--settings=mse.settings.staging

Backup remote
~~~~~~~~~~~~~~

Run this local script which creates the backup copy on the
remote server.
(configured .pgpass in root)
::
		
	cd ~/Documents/Projects/MysticSeaport/MSE20/DataBaks/scripts
	ssh root@68.169.52.41 'bash -s' < copy_msedb.sh
	(root password)

Further progress would be to see if the script will run as mseadmin, and, if so,
put the script on the server, and see if it runs from there.
This would make it accessible to anyone with mseadmin login. 

Backup msedb -- older terminal/login method
Login as root:
::

	cd /var/www/mseadmin/data/FTP_transfer
	pg_dump -Fc --clean --verbose msedb --user=msedb_user > msedb_$(date +"%Y_%m_%d").backup
	(password is now stored on server) [msedb_user password]
    [msedb_user password -- in Django settings]

If you need to go back to the active virtenv:
::
    cd /var/www/mseadmin/data/www/msedev.mysticseaport.org/mse (or workon mse)

[or, use PGAdmin with which I have a direct connection to eApps mse db]


Update Educators Database
--------------------------

Copy data to educators
Note msedb_ed as the target.
Log into shell as root
::

	su - postgres
	cd /var/www/mseadmin/data/FTP_transfer
	pg_restore --clean --dbname=msedb_ed --user=msedb_user --verbose msedb_$(date +"%Y_%m_%d").backup
	[db password here]
(will likely get 2 errors, but that's ok.)


restore local
~~~~~~~~~~~~~~

[Looks like we still have to do this rather than wget -- must not have wget set up]
Transfer to local via FTP mystic root.
Then, the command line approach:
::

	cd ~/Documents/Projects/MysticSeaport/MSE20/DataBaks/from_remote
	pg_restore --clean --dbname=mse2db --verbose msedb_$(date +"%Y_%m_%d").backup

[Or use PGAdmin3 to restore -- hmm, returned 0, didn't work 2017-09-06]

wget effort so far:
(hmm, doesn't work, FTP_transfer permissions, mixup on user, password)
::
	cd ~/Documents/Projects/MysticSeaport/MSE20/DataBaks/from_remote
	wget --user=mseadmin --password='[enter by hand]' ftp://msedev.mysticseaport.org/FTP_transfer/msedb_$(date +"%Y_%m_%d").backup


