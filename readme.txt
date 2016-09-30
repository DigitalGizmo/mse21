Django Notes


As of February 2016 the active development elements:
	directory: msedev.mysticseaport.org 
	env:  mse -- mse2 is a duplicate - wsgi uses mse
	branch: develop
	settings: mse/settings/staging
	database: msedb
	static: mse_static

Public, live
	dir: educators.mysticseaport.org
	env: mse_ed
	branch: develop
	static: mse_static

Local, Don's machine
	env: mse2 (mse leads to old project)

Transition to MSE 2.0
----------------

* Static
	mse1_static is outside of educators and msedev -- initially shared by both

	
	Maps
		Currently handled through Google Fusion Tables
		Keys managed in Don's digitalgizmo account via: https://console.developers.google.com/project
