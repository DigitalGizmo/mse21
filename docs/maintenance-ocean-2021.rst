

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
