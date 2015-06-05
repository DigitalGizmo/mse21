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

eApps
----------

Clone. This will create the Master files. Switch right away to the mse2 branch.

