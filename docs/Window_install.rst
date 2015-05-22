Django / Python installation notes for Windows
============================================

Mike: I know the plan is to install this for use with MS SQL Server—and that’s what the steps below cover. I’ll throw this out one (more) time and then never mention it again—if you are willing to consider MySQL: the Django installation would be simpler and the project would be more portable, in the future, to other servers and platforms. 

Having said that, I realize there are probably pretty compelling institutional reasons to stick with MS SQL, so, we’ll go with that.

1. Install Python 2.7
---------------------

This is a prerequisite to all that follows and it’s pretty easy. This page, http://edgylogic.com/blog/developing-django-windows/, has a link to the right brand and version of Python. (DO NOT use the instruction on this page for installing Django – “pip install Django” will give you version 1.5 – but we need 1.4 in order to work with MS SQL.) (Unless you want to take the easy route with MySQL ;-)
Be sure, as they indicate, to get version 2.7. http://www.activestate.com/activepython/downloads 

* (Notes on Seaport server install: to download from this site I needed to set this as a trusted site. [tools, internet option, security tab , trusted zone, then sites.]
Added http://downloads.activestate.com. And activestate.com
Downloaded: ActivePython-2.7.2.5-win64-x64.msi. Received admin privileges and was able to install)

To test that Python is working, open a Command Prompt window and type “python” (and enter). Should come up with version info and a prompt: >>>
To quit: quit()

At this point, depending on my command-line access, I may be able to do the rest.

2. Install Django 1.4
---------------------

(For the MySQL fork you’d just type “pip instll Django” at the command line and you’d have the current version 1.5)

Go to : https://docs.djangoproject.com/en/1.4/topics/install/
Follow the instructions for “Installing an official release manually” (two-thirds of the way down the page.

Notes on each step:
1. The page is : https://www.djangoproject.com/download/ 
	- In the right column under “Previous releases” click on Django-1.4.5.tar.gz
I copied the download to a working directory that was neither downloads nor python.
(at first click it started downloading as binary characters in the browse window. Added www.djangoproject .com to trusted sites. Used right-click to save target.)
2. I did download and installed 7-zip to unpack the tar.gz (free: http://www.7-zip.org/ )
(Downloaded 7-zip: Had to add http://downloads.sourceforge.net to trusted zone by hand. Had a bit of a run-around because the actual download was coming from a mirror on a different domain.)

3. cd to that working directory from the command line.
C:/DjangoInstall/Django14
Juggled directory names to simplify to C:/DjangoInstall/Django11.4.5

4. “python setup.py install” worked for me. The Python install should have put Python on the path.
Tons of command lines should stream by.

The test to make sure this worked is on https://docs.djangoproject.com/en/1.4/intro/install/ 
Down at the bottom under “Verifying.” This is all it says:
To verify that Django can be seen by Python, type python from your shell. Then at the Python prompt, try to import Django::

    $ python
    >>> import django
    >>> print django.get_version()
    1.4

Cool – worked.

I set up the beginnings of an app for OLC in preparation for setting up the databasse
(* need to decide on directory structure

2.2 set up initial Django app
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Create a sites directory – c:/sites. Django code doesn’t go under the web server’s root.
In the command prompt cd to sites and type: “django-admin.py startproject olc”
cd to the (outer) olc and check with python manage.py runserver.
127.0.0.1:8000 doesn’t work. Maybe because it’s a virtual server or whatever. Defer problem until after dealing with IIS

3. IIS
-------------

This page contains a step by step process that actually worked: 
http://mrtn.me/blog/2012/06/27/running-django-under-windows-with-iis-using-fcgi/ 
	
Adding FastCGI – went to the fcgi.py link, copied the text, made a file called fcgi.py and placed it in c:/python27/Lib/site-packages/django/core/management/commands
Tested OK with the help command line.

Configure the FastCGI application on IIS
Adding the application
path: C:\Python27\python.exe
arguments: C:\sites\olc\manage.py fcgi --pythonpath=C:\sites\olc --settings=olc.settings
	(not sure if the olc path depth is correct)
added this to Monitor changes per instructions: C:\sites\olc\olc\settings.py

FastCGI application
New site:
site name, app pool: olc
Pys path: C:\sites\olc\olc

added web.config with this specific info"
<add name="FastCGI" path="*" verb="*" modules="FastCgiModule" scriptProcessor="C:\python27\python.exe|C:\sites\olc\manage.py fcgi --pythonpath=c:\sites\olc --settings=olc.settings" resourceType="Unspecified" requireAccess="Script" />

Able to go to http://django.mysticseaport.org/

Static Files
add to settings.py: import os
add directory to sites/olc/olc > local_static
Add the variable per the sites directions
collect 


Alt approach?
https://docs.djangoproject.com/en/1.5/howto/deployment/fastcgi/

POST NOTE
Add dir to sites/olc: fcgi_logs (must do, or else 500 error!)
in c:/python27/Lib/site-packages/django/core/management/commands/fcgi.py
	change line 104, FCGI_LOG_PATH to 
FCGI_LOG_PATH = os.path.join(getattr(settings, 'FCGI_LOG_PATH', os.path.dirname(os.path.abspath(sys.argv[0]))), 'fcgi_logs')

Later in IIS - set up mime types for mp4 and webm
http://www.codingstaff.com/learning-center/other/how-to-add-mime-types-to-your-server

4. MS SQL Server Connection
-------------------------

Set up the database
~~~~~~~~~~~~~~~~~~~

In any case, and definitely on your end, we’ll need to set up a new database in SQL Server. We could call it olcdb and the user could be olcdb_user. You could set a password and let me know.

Install MS Sql Server

~~~~~~~~~~~~~~~~~~~~~~
Microsoft SQL Server 2005 Express Edition
Install says I need to install SP3 before running. Downloaded it
Install:
Named instance: SQLExpress
Default: Use built-in System account, Network Service
Mixed mode, pass: django_installation
Collation - default: SQL, Dictionary order case insensitive
Left Enable User Instance checked
Ran SP3
Downloaded and installed managment studio express SP3
http://www.microsoft.com/en-us/download/details.aspx?id=14630

Set up database
~~~~~~~~~~~~~~~

Run management studio as administrator
logged in as Window Auth
Created database:
name: django_db
owner: <default>
Security, new Login
	django_user
	pass: azorean$1965
unchecked enforcement
Roles: serveradmin, public -- 
doesn't cover table creation - added serveradmin, setupadmin, sysadmin
Map django_db: public, db datawriter, db datareader -- added db_access admin, db_owner

Install pyodbc
~~~~~~~~~~~~~~~

From https://code.google.com/p/pyodbc/ download and run (install) pyodbc-3.0.6.win32-py2.7.exe . 
(Can also be installed from source zip: Put in python27/Scripts and expanded. (I removed the redundant enclosing directory.) Then navigate to python27/Scripts and run easy_install pyodbc.)
used pyodbc-3.0.6.win-amd64-py2.7.exe

Test against Python (leaving Django out for the moment)
https://code.google.com/p/pyodbc/wiki/GettingStarted 
Change the following to specifics in a table in the new, or any, database. This goes in a py script that you run with python:
import pyodbc
cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=DJANGO\SQLEXPRESS;DATABASE=django_db;UID=django_user;PWD=azorean$1965')
cursor = cnxn.cursor()
cursor.execute("select don_test from test_don")
rows = cursor.fetchall()
for row in rows:
    print row.don_test

Set up Django-pyodbc
~~~~~~~~~~~~~~~~~~~

$ pip install https://github.com/avidal/django-pyodbc/archive/django-1.4.zip
The winning reference is buried on this page:
http://stackoverflow.com/questions/10851237/use-django-pyodbc-sqlserver-issue

This installs to a directory in python27/Lib/site-packages/sql_server. That sql_server dir needs to be moved (or copied) to ../site-packages/django/db/backends/

Config settings to talk to database
This is moving beyond the land of installation and into application development, but...
https://docs.djangoproject.com/en/1.4/intro/tutorial01/  
Follow Database Setup
Settings.py:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sql_server.pyodbc', 
        'NAME': 'django_db',          
        'USER': 'django_user',                      
        'PASSWORD': 'azorean$1965',                  
        'HOST': 'DJANGO\SQLEXPRESS',                      
        'PORT': '',   # Set to empty string for default.
    }

command line from c:\sites\olc > python manage.py syncdb
Now we're definitely in the land of app development!

(next config admin, [why no style sheet? static! I bet]

Additional modules
South
TinyMCE
Fabric
see Fabric_Install.pages (doc)
Outtakes
IIS
Thought this was going to be the way to go, but it didn't work:
This page contains a script that automates setting up the connection to IIS. It runs after the Django admin is all up and running. Even after that’s set up I may not be able to run it because of permissions—it changes IIS settings—but maybe you will be able to.
http://django-windows-tools.readthedocs.org/en/latest/ 

follow pip install django-windows-tools
pip must already be part of ActiveState Python

run python manage.py collectstatic 
(make sure the app in setting.py uses underscores: django_windows_tools.
When I made the mistake of using hyphens, I had entered this:
Added a System variable PYTHONPATH
C:\Python27:C:\Python27\DLLs;C:\Python27\Lib;C:\Python27 \Lib\site-packages;C:\Python27 \Lib\site-packages\django;

Had a problem accessing “sites” in IIS manager. Maybe because I didn’t use “DJANGO/” in front of my login name at the point where I was trying to connect within IIS manager. In any case, Mike got “Sites” to appear.

Made a temp site to test the connection—fine.

Prerequisite CGI installed on IIS
http://technet.microsoft.com/en-us/library/cc753077(WS.10).aspx 
Looks like it’s already installed

C:\sites\olc> python manage.py winfcgi_install --binding=http://django.mysticseaport.org:80

Hmm, seems that the CGI module is not installed after all

http://technet.microsoft.com/en-us/library/cc753077(WS.10).aspx 
Followed this to turn on FastCGI
Uninstalled and reinstalled CGI

So, this auto Django-windows-tools script may not be working. 
Proceed with the by-hand method below

Just in case PIP is needed and not documented elsewhere

May need to install PIP
http://www.pip-installer.org/en/latest/

PIP http://www.pip-installer.org/en/latest/
Actually download from: ***
 Or try msi: http://www.lfd.uci.edu/~gohlke/pythonlibs/#pip
 build from?: https://github.com/pypa/pip 


Also:
Python install puts and entry in the Start menu for “ActiveState Python 2.7. In that group there’s a link to an IDE that can be handy for testing, but mostly we’ll be using the Windows Command Line. 

Outtakes from django_windows_tools
get the source from https://github.com/antoinemartin/django-windows-tools 
Put into DjangoInstallFiles
Cd to the expanded directory
python setup.py install
succesfully installed in python lib site-packages
 
FastCGI config
python manage.py collectstatic
dj win tools not found!*
