Create MSE Educators
========================

The public project (educators) is going to be looking at mse1_static -- won't have any assets of its own.

eApps
------

Clone Database
~~~~~~~~~~

Backup msedb
::

	cd /var/www/mseadmin/data/FTP_transfer
	pg_dump -Fc --verbose msedb --user=msedb_user > msedb_2015_06_18.backup
    [msedb_user password]

Resore db. For data copy, need to edit /var/lib/pgsql/data/pg_hba.conf to add this:
::

    local msedb_ed msedb_user md5

Copy data
::

	su - postgres
	cd /var/www/mseadmin/data/FTP_transfer
	pg_restore --dbname=msedb_ed --user=msedb_user --verbose msedb_2015_06_18.backup

Can't connect via psql as postgres (without adding to pg_hba) so change public schema owner in phpPgAdmin.
See Maintenance for connection.
List Schemas, Alter owner to msedb_user.

GIT project in place
~~~~~~~~~~~~~~~~~~~~~

Clone
Delete educators.mysticseaport.org
Clone. This will create the Master files.
Run the clone command from ../data/www
::

    ssh root@68.169.52.41
    cd /var/www/mseadmin/data/www/
    git clone https://github.com/knowyourider/mse20 educators.mysticseaport.org


Create Virtual env
~~~~~~~~~~~~~~~~
::

	mkvirtualenv -a /var/www/mseadmin/data/www/educators.mysticseaport.org/mse --python=/usr/local/bin/python3.4 mse_ed

	workon mse_ed

Pip installs
::

	Django==1.8.2
	psycopg2==2.6
	Unipath==1.1


WSGI for mse_ed
~~~~~~~~~~~~~

in /etc/httpd/conf/vhosts/mseadmin
::
	
	vim educators.mysticseaport.org

	#user 'mseadmin' virtual host 'educators.mysticseaport.org' configuration file
	<VirtualHost 68.169.52.41:80>
        ServerName educators.mysticseaport.org
        AddDefaultCharset off
        DirectoryIndex index.html index.php
        DocumentRoot /var/www/mseadmin/data/www/educators.mysticseaport.org
        ServerAdmin donpublic@digitalgizmo.com
        SuexecUserGroup mseadmin mseadmin
        ServerAlias temp.educators.mysticseaport.org
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
        CustomLog /var/www/httpd-logs/educators.mysticseaport.org.access.log combined
        ErrorLog /var/www/httpd-logs/educators.mysticseaport.org.error.log



        Alias /static/ /var/www/mseadmin/data/www/mse1_static/

        WSGIDaemonProcess production python-path=/var/www/mseadmin/data/www/educators.mysticseaport.org/mse:/var/www/mseadmin/data/.envs/mse_ed/lib/python3.4/site-packages
        WSGIProcessGroup production
        WSGIScriptAlias / /var/www/mseadmin/data/www/educators.mysticseaport.org/mse/mse/wsgi.py

        <Directory /var/www/mseadmin/data/www/educators.mysticseaport.org/mse/mse>
        <Files wsgi.py>
        Order deny,allow
        Allow from all
        </Files>
        </Directory>



	</VirtualHost>
	<Directory /var/www/mseadmin/data/www/educators.mysticseaport.org>
        php_admin_flag engine on
        Options +Includes -ExecCGI
	</Directory>

WSGI for mpmrc
---------------

in cd /etc/httpd/conf/vhosts/mseadmin
::
    
    vim mpmrc.mysticseaport.org

    ...
    Alias /static/ /var/www/mseadmin/data/www/mse1_static/

    WSGIDaemonProcess production_pq python-path=/var/www/mseadmin/data/www/educators.mysticseaport.org/mse:/var/www/mseadmin/data/.envs/mse_ed/lib/python3.4/site-packages
    WSGIProcessGroup production_pq
    WSGIScriptAlias / /var/www/mseadmin/data/www/educators.mysticseaport.org/mse/mse/wsgi.py

    <Directory /var/www/mseadmin/data/www/educators.mysticseaport.org/mse/mse>
    <Files wsgi.py>
    Order deny,allow
    Allow from all
    </Files>
    </Directory>

    ...
