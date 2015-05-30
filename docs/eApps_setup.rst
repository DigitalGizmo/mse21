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

Resore on eApps. For data copy, log in to shell as mseadmin -- that's the database owner.
::

    cd /var/www/dino_user/data/FTP_transfer
    (/var/www/mseadmin/data/www/msedev.mysticseaport.org/scripts)
    pg_restore -O --dbname=msedb --verbose mse_2015_05_29.backup

    psql: FATAL:  no pg_hba.conf entry for host "[local]", user "mseadmin", database "postgres", SSL off

Here's the answer-- log in as root, then:
::
    
    su postgres


within virtenv
::

    yum install python-psycopg2



