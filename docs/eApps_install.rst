eApps Mystic install commands
==========================

tools
-----------
yum groupinstall "Development tools"
yum install zlib-devel
yum install bzip2-devel
yum install openssl-devel
yum install ncurses-devel
yum install sqlite-devel

Python
------------
cd /usr/local/src
wget http://python.org/ftp/python/3.4.3/Python-3.4.3.tar.xz
tar xf Python-3.4.3.tar.xz
cd Python-3.4.3
./configure --prefix=/usr/local --enable-shared LDFLAGS="-Wl,-rpath /usr/local/lib"
make && make altinstall

WSGI
------------
yum install httpd-devel-2.2.29 (eApps did this)

wget https://github.com/GrahamDumpleton/mod_wsgi/archive/4.4.10.tar.gz
tar xf 4.4.10.tar.gz
cd mod_wsgi-4.4.10
./configure --with-python=/usr/local/bin/python3.4
make
make install

cd /etc/httpd/conf.d
create wsgi.conf
LoadModule wsgi_module modules/mod_wsgi.so

virt env
-----------
::

        pip3.4 install virtualenvwrapper

- in .bash_profile
export WORKON_HOME=/var/www/mseadmin/data/.envs
export PROJECT_HOME=/var/www/mseadmin/data/www
### to use Python 3
export VIRTUALENVWRAPPER_PYTHON=/usr/local/bin/python3.4
export VIRTUALENVWRAPPER_VIRTUALENV=/usr/local/bin/virtualenv-3.4
source /usr/local/bin/virtualenvwrapper.sh

error on login - fixed by VIRTUALENVWRAPPER_PYTHON etc above
Last login: Thu Mar 26 15:18:50 2015 from pool-108-20-205-135.bstnma.fios.verizon.net
/usr/bin/python: No module named virtualenvwrapper
virtualenvwrapper.sh: There was a problem running the initialization hooks. 

If Python could not import the module virtualenvwrapper.hook_loader,
check that virtualenvwrapper has been installed for
VIRTUALENVWRAPPER_PYTHON=/usr/bin/python and that PATH is
set properly.
::

        mkproject --python=/usr/local/bin/python3.4 msedev.mysticseaport.org

[root@msedev ~]# mkproject --python=/usr/local/bin/python3.4 msedev.mysticseaport.org
Already using interpreter /usr/local/bin/python3.4
Using base prefix '/usr/local'
New python executable in msedev.mysticseaport.org/bin/python3.4
Also creating executable in msedev.mysticseaport.org/bin/python
Installing setuptools, pip...done.
Creating /var/www/mseadmin/data/www/msedev.mysticseaport.org
Setting project for msedev.mysticseaport.org to /var/www/mseadmin/data/www/msedev.mysticseaport.org
(msedev.mysticseaport.org)[root@msedev msedev.mysticseaport.org]# 

Install Django
--------------
pip install django

WSGI part 2
-----------

in /etc/httpd/conf/vhosts/mseadmin msedev.mysticseaport.org
::
	#user 'mseadmin' virtual host 'msedev.mysticseaport.org' configuration file
	<VirtualHost 68.169.52.41:80>
        ServerName msedev.mysticseaport.org
        AddDefaultCharset off
        DirectoryIndex index.html index.php
        DocumentRoot /var/www/mseadmin/data/www/msedev.mysticseaport.org
        ServerAdmin webmaster@msedev.mysticseaport.org
        SuexecUserGroup mseadmin mseadmin
        ServerAlias www.msedev.mysticseaport.org
        ScriptAlias /cgi-bin/ /var/www/mseadmin/data/www/msedev.mysticseaport.org/cgi-bin/
        CustomLog /var/www/httpd-logs/msedev.mysticseaport.org.access.log combined
        ErrorLog /var/www/httpd-logs/msedev.mysticseaport.org.error.log

        Alias /static/ /var/www/mseadmin/data/www/msedev.mysticseaport.org/mse/static/

        WSGIDaemonProcess staging python-path=/var/www/mseadmin/data/www/msedev.mysticseaport.org/mse:/var/www/mseadmin/data/.envs/mse/lib/python3.4/site-packages
        WSGIProcessGroup staging
        WSGIScriptAlias / /var/www/mseadmin/data/www/msedev.mysticseaport.org/mse/mse/wsgi.py

        <Directory /var/www/mseadmin/data/www/msedev.mysticseaport.org/mse/mse>
        <Files wsgi.py>
        Order deny,allow
        Allow from all
        </Files>
        </Directory>

	</VirtualHost>
	<Directory /var/www/mseadmin/data/www/msedev.mysticseaport.org>
	        Options +Includes +ExecCGI
	</Directory>
	~            	
    
