Create MSE 2.0 Sandbox
========================

Local
----------

Clone project to new directory.
While in Sites. (on eApps it's going go to msesand.mysticeaport.org rather than mse2_project)
::

	git clone https://github.com/knowyourider/mse20.git mse2_project


Create virtual env
~~~~~~~~~~~

Create with existing dir
::

	mkvirtualenv -a /Users/don/Sites/mse2_project/mse --python=/usr/local/bin/python3.4 mse2
	pip install Django
	pip install Unipath
	pip install psycopg2

Copy over some static files and test w/ exiting db

Clone Database to mse2db
::

	cd ~/Documents/Projects/MSE20/DataBaks/from_remote
	createdb mse2db --owner=msedb_user
	pg_restore --dbname=mse2db --verbose mse_2015_06_02_noo.backup

	psql postgres
	\connect mse2db
	ALTER SCHEMA public OWNER to msedb_user;


Create branch
~~~~~~~~~~~~~~
::

	git checkout -b mse2

Settings, Version Theory
~~~~~~~~~~~~~~~~~

Setting.base will have db pointing to mse2.
We don't need to have staging, staging2 etc. because having two devels is a temporary situation.
Soon enough they will be merged.

Let's try Invoke for automating collect static etc.
::

	pip install invoke==dev --allow-unverified invoke

eApps
----------


Create sandbox
~~~~~~~~~~~~~

Clone
Delete msesand.mysticseaport.org
Clone. This will create the Master files. Switch right away to the mse2 branch.
Run the clone command from ../data/www
::

    ssh root@68.169.52.41
    cd /var/www/mseadmin/data/www/
    git clone https://github.com/knowyourider/mse20 msesand.mysticseaport.org

Resore db on eApps. For data copy, need to edit /var/lib/pgsql/data/pg_hba.conf to add this:
::

    local mse2db msedb_user md5

Copy data
::

	su - postgres
	cd /var/www/mseadmin/data/FTP_transfer
	pg_restore --dbname=mse2db --user=msedb_user --verbose mse_2015_06_02_noo.backup

	psql postgres
	\connect mse2db
	ALTER SCHEMA public OWNER to msedb_user;

Create Virtual env
------------------
::

	mkvirtualenv -a /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse --python=/usr/local/bin/python3.4 mse2

Pip installs as above for local

only diffs are what's checked out, what's in static, which settings you call which only changes database.

Move static out of project
---------------------------

as root
::

	cd /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse
	mv static ../../mse1_static

Shell script for collect static
-----------------------

Location: /var/www/mseadmin/data/msesand_collect.sh
Run by logging into ISP Manager as mseadmin
::

	#!/bin/sh

	# pythonpath path/python module.py command options
	PYTHONPATH=/var/www/mseadmin/data/www/msesand.mysticseaport.org/mse:/var/www/mseadmin/data/.envs/mse/lib/python3.4/site-packages/ /usr/local/bin/python3.4 /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/manage.py collectstatic -v0 --noinput --settings=mse.settings.staging_2


Symbolic Links to make model work online
---------------------------------------

For eApps/online, the path to any static model asset has to start with /model/ (or /static/ but that would 
require the designer to be able to collectstatic)
These the sym directories are excluded in .gitignore. The need to be created separately on local and staging 
environments.
local
::
	
	cd ~/Sites/mse2_project/mse/model
	ln -s ~/Sites/mse2_project/mse/local_static ~/Sites/mse2_project/mse/model/model_local_static
	ln -s ~/Sites/mse2_project/mse/artifacts/static/artifacts ~/Sites/mse2_project/mse/model/artifact_static

eapps
::
	
	cd /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/model
	ln -s /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/local_static /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/model/model_local_static
	ln -s /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/artifacts/static/artifacts /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/model/artifact_static

WSGI for mse2
---------------

in /etc/httpd/conf/vhosts/mseadmin
::
	
	vim msesand.mysticseaport.org

	#user 'mseadmin' virtual host 'msesand.mysticseaport.org' configuration file
	<VirtualHost 68.169.52.41:80>
        ServerName msesand.mysticseaport.org
        AddDefaultCharset off
        DirectoryIndex index.html index.php
        DocumentRoot /var/www/mseadmin/data/www/msesand.mysticseaport.org
        ServerAdmin donpublic@digitalgizmo.com
        SuexecUserGroup mseadmin mseadmin
        ServerAlias www.msesand.mysticseaport.org
        <FilesMatch "\.ph(p[3-5]?|tml)$">
                SetHandler application/x-httpd-php
        </FilesMatch>
        <FilesMatch "\.phps$">
                SetHandler application/x-httpd-php-source
        </FilesMatch>
        php_admin_value sendmail_path "/usr/sbin/sendmail -t -i -f donpublic@digitalgizmo.com"
        php_admin_value upload_tmp_dir "/var/www/mseadmin/data/mod-tmp"
        php_admin_value session.save_path "/var/www/mseadmin/data/mod-tmp"
        php_admin_value open_basedir "/var/www/mseadmin/data:."
        CustomLog /var/www/httpd-logs/msesand.mysticseaport.org.access.log combined
        ErrorLog /var/www/httpd-logs/msesand.mysticseaport.org.error.log

        Alias /static/ /var/www/mseadmin/data/www/mse2_static/
        Alias /model/ /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/model/

        WSGIDaemonProcess staging_2 python-path=/var/www/mseadmin/data/www/msesand.mysticseaport.org/mse:/var/www/mseadmin/data/.envs/mse/lib/python3.4/site-packages
        WSGIProcessGroup staging_2
        WSGIScriptAlias / /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/mse/wsgi.py

        <Directory /var/www/mseadmin/data/www/msesand.mysticseaport.org/mse/mse>
        <Files wsgi.py>
        Order deny,allow
        Allow from all
        </Files>
        </Directory>

	</VirtualHost>
	<Directory /var/www/mseadmin/data/www/msesand.mysticseaport.org>
        php_admin_flag engine on
        Options +Includes -ExecCGI
	</Directory>

