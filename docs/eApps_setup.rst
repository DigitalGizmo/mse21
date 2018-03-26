Setting up the eApps environment
=============================

See separate doc for installations

Clone GIT repository
----------------------

Initial local establishment of repository
::

	git remote add origin https://github.com/knowyourider/mse20

Clone
First zip and move msedev.mysticseaport.org
Run the clone command from ../data/www
::

	ssh root@68.169.52.41
	cd /var/www/mseadmin/data/www/

	git clone https://github.com/knowyourider/mse20 msedev.mysticseaport.org

Create Virtual env
------------------
::

	mkvirtualenv -a /var/www/mseadmin/data/www/msedev.mysticseaport.org/mse --python=/usr/local/bin/python3.4 mse

Install database
----------------

From eApps support
System-wide
::

    yum install gcc python-setuptools python-devel postgresql-devel

This installed postgresql (9.4.1) as a dependency.
Tech support had to straighten this out.


Within virtenv
Tried installing yum install python-psycopg2 but that didn't show up in the virt env per lssitepackages

pip Worked
::

    pip install psycopg2


Create Database
----------------
In ISP as root: Tools > Databases
    new - owner mseadmin, new user per settings

Backup local
::

    cd ~/Documents/Projects/MSE20/DataBaks
    pg_dump -OFp --verbose msedb > mse_2015_05_29.sql
    or compact
    pg_dump -OFc --verbose msedb > mse_2015_05_29.backup

Resore on eApps. For data copy, Had problems, but eApps support edited /var/lib/pgsql/data/pg_hba.conf to add this:
::

    local msedb msedb_user md5

Which allows this:
::

    su - postgres
    cd /var/www/mseadmin/data/FTP_transfer
    pg_restore -O --dbname=msedb --user=msedb_user --verbose mse_2015_05_29.backup

Error on migrations table because it already existed.
Export local, then delete and copy remote.
::
    
    su postgres

log Locations
--------------
/var/www/httpd-logs/

