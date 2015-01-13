### Synchronisation via rsync
[Synchronisation automatique vers votre NAS](http://www.legeektechno.fr/serveurs/script-de-synchronisation-de-seedbox-version-2.html)

Génération de la clé RSA
```
ssh-keygen -t rsa
ssh-copy-id -i ~/.ssh/id_rsa.pub root@monippublique 
```
Modification de l'emplacement des fichier logs
```
mkdir -p /var/log/rsync
chown -R batch /var/log/rsync
chgrp -R batch /var/log/rsync
cd /home/batch/scripts
nano setEnv.sh
```
Modifier la valeur LOGS_DIR par
```
LOGS_DIR=/var/log/rsync
```

