Django Notes

Version differences
-------------------

* Development
	* "management" app is included -- supports internal link to collect static.

Legacy Windows setup
--------------------
Multiple Site configuration directories
	IIS points to a separate settings directory for each site. It's my understanding that it's necessary for IIS to have a root dir to point to each site/url. 
	All settings files are tracked in GIT, so each set is copied in both olc and educators.
	
	Development 
	sites/olc
		olc (MSE devel)
		pqdev (CT @ Work exhibit devel)
			The static directory here is a symbolic link to the one in olc/olc
			This settings.py file points to the url.py in olc/olc
	
	Production/public
	sites/educators
		educators (MSE public)
			The static directory here is a symbolic link to the one in olc/olc
		mpmrc (CT @ Work exhibit public)
			The static directory here is a symbolic link to the one in educators/educators
			This settings.py file points to the url.py in educators/educators
	
	Maps
		Currently handled through Google Fusion Tables
		Keys managed in Don's digitalgizmo account via: https://console.developers.google.com/project