

Overall
    each version, msedev and ed, have their own wsgi files

Public, live
    dir: educators.mysticseaport.org
    env: /srv/venv/mse_ed
    branch: develop
    static: mse_static


Static
    the actual files are in msedev ../../ static
    mse_static has symlinks to the actual file
        (need to look up syntax for collect static with links)


Backup remote
~~~~~~~~~~~~~~

Run this local script which creates the backup copy on the
remote server.

NOTE: Ah, need to config .pgpass first!!
Have edited copy_msedb_ocean.sh

(configured .pgpass in root)


::
        
    cd ~/Documents/2-Areas-Work/MysticSeaport/DataBaks/scripts
    ssh root@143.198.12.96 'bash -s' < copy_msedb_ocean.sh

    (root password)
