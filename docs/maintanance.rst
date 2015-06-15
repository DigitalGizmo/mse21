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
Batch file is at /usr/local/bin
Executed by msedev.mysticseaport.org/management/collect
Since Apache is executing this, the ownership of mse/static is apache:apache