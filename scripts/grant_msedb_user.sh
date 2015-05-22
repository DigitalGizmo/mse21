#!/bin/sh

dbname="msedb"
username="don"
db_user="msedb_user"

psql $dbname $username << EOF
	GRANT ALL ON ALL TABLES IN SCHEMA public to $db_user;
	GRANT ALL ON ALL SEQUENCES IN SCHEMA public to $db_user;
	GRANT ALL ON ALL FUNCTIONS IN SCHEMA public to $db_user;
EOF
