evolving documentation
=======================

(non) evolution of the main menu
--------------------
MSE 1 didn't have much of a main menu. In any case, if I was starting from scratch
I would have created a main menu model and each resource type would be a child
tied with a foreign key. As it is, I've done a lot of work-arounds with the Menu model.

For this reason I had to add "class" variables such as
    _app_namespace = "scholars"
    _resource_type = "lecture"
to all resource types. 

outliers
------------
settings_extras
* this is a custom tag in the general app that allows access to the IS_PRODUCTION setting

Maintenance Tips
--------------

phpPgAdmin
http://68.169.52.41/phppgadmin/
postgres
pass: the password can be gotten from the Control Panel (ISPManager), simply go to Settings -> Database servers. Click on PostgreSQL and then on the Edit button. 
