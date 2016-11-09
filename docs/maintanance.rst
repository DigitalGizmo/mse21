Maintanance
============

Database backups and transfers to local
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

	manpy (aText) expands to
	./manage.py
	(then)
	migrate
	setmse (atext) expands to 
	--settings=mse.settings.staging

Backup remote and restore local
~~~~~~~~~~~~~~~~~~~~~~~~~~

On eapps, login as root. We're not using the -O option since local and remote have the same user.
Maybe su - postgres avoid the error below?)
::

    cd /var/www/mseadmin/data/FTP_transfer
	pg_dump -Fc --clean --verbose msedb --user=msedb_user > mse_2015_06_02.backup
    [msedb_user password]
	
    cd /var/www/mseadmin/data/www/msedev.mysticseaport.org/mse (or workon mse)

Transfer to local via FTP mystic root.
::

	cd ~/Documents/Projects/MSE20/DataBaks/from_remote
	pg_restore --clean --dbname=msedb --verbose mse_2015_06_02_noo.backup

One error ignored: revoking and granting on user postgres.
(Maybe loging in as postgre would help? May need to alter local setup)
Line to fix the owner of public:
::

	psql postgres
	\connect msedb
	ALTER SCHEMA public OWNER to msedb_user;

Collect static
~~~~~~~~~~~~~~~~
Batch file is at /usr/local/bin
Executed by msedev.mysticseaport.org/management/collect
Since Apache is executing this, the ownership of mse/static is apache:apache

Renew WSGI for code change
~~~~~~~~~~~~~~~~~~~~~~~
::

	touch /var/www/mseadmin/data/www/educators.mysticseaport.org/mse/mse/wsgi.py
	touch /var/www/mseadmin/data/www/msedev.mysticseaport.org/mse/mse/wsgi.py
	touch /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/mse/wsgi.py


Update Educators Database
~~~~~~~~~~

Backup msedb
Login as root:
::

	cd /var/www/mseadmin/data/FTP_transfer
	pg_dump -Fc --clean --verbose msedb --user=msedb_user > msedb_$(date +"%Y_%m_%d").backup
    [msedb_user password -- in Django settings]

Newer approach to backup -- run this local script which creates the backup copy on the
remote server.
Oops, the following doesn't work:
pg_dump: [archiver (db)] connection to database "msedb" failed: fe_sendauth: no password supplied

I think I must need to configure the db password to a remote file, like .htaccess
::
		
	cd ~/Documents/Projects/MysticSeaport/MSE20/DataBaks/scripts
	ssh root@68.169.52.41 'bash -s' < copy_msedb.sh
	(root password)

Further progress would be to see if the script will run as mseadmin, and, if so,
put the script on the server, and see if it runs from there.
This would make it accessible to anyone with mseadmin login. 

Copy data
Note msedb_ed as the target.
::

	su - postgres
	cd /var/www/mseadmin/data/FTP_transfer
	pg_restore --clean --dbname=msedb_ed --user=msedb_user --verbose msedb_$(date +"%Y_%m_%d").backup

Got an error that may be two-wrongs-make-a-right:
pg_restore: [archiver (db)] Error from TOC entry 5; 2615 2200 SCHEMA public postgres
pg_restore: [archiver (db)] could not execute query: ERROR:  must be member of role "postgres"
    Command was: ALTER SCHEMA public OWNER TO postgres;

can ignore the change of owner below:

Can't connect via psql as postgres to msedb_ed (without adding to pg_hba) so change public schema owner in phpPgAdmin.
See above for connection.
List Schemas > Alter > owner to msedb_user.

Backup mse2 db and apply locally
--------------------------
eapps, logged in as root
::

  cd /var/www/mseadmin/data/FTP_transfer
	pg_dump -Fc --clean --verbose mse2db --user=msedb_user > mse2db_2015_10_28.backup
  [msedb_user password]

  cd /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse (or workon mse)
	
Download via FTP
Or, try wget
Transfer to local via FTP pvma root.
(hmm, doesn't work, FTP_transfer permissions, mixup on user, password)
::
	cd ~/Documents/Projects/MysticSeaport/MSE20/DataBaks/from_remote
	wget --user=root --password='?' ftp://68.169.52.41/FTP_transfer/msedb_$(date +"%Y_%m_%d").backup

Restore locally
::

	cd ~/Documents/Projects/MysticSeaport/MSE20/DataBaks/from_remote
	pg_restore --clean --dbname=msedb --user=msedb_user --verbose msedb_$(date +"%Y_%m_%d").backup
	(??: pg_restore --clean --dbname=mse2db --verbose mse2db_2015_10_28.backup)


