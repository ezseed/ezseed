EZSEED (easy seedbox)
===

Toujours en cours de travaux ;)

## Pré-requis

### Nodejs
[Node version manager](https://github.com/creationix/nvm) est recommandé

### MongoDB
[Instructions d'installation](http://docs.mongodb.org/manual/installation/)

### Server
Si aucun serveur n'est présent, [ezseed installera nginx](https://github.com/ezseed/ezseed/blob/master/scripts/server.sh)
Si vous avez déjà installé un serveur web, ezseed ajoutera sa configuration apache ou nginx (note: apache n'a pas encore été testé)

## Installation

### Dépendances

```
sudo aptitude install gcc-4.7 sudo curl python

# nvm - nodejs
curl https://raw.githubusercontent.com/creationix/nvm/v0.17.1/install.sh | bash
source ~/.bashrc
nvm install 0.10.32
nvm alias default 0.10.32

# mongodb
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org

```

### Ezseed

#### En tant qu'utilisateur
```
npm i pm2@rc ezseed -g
# suivez les instructions de configuration
```

#### En tant que `root`

```
npm i ezseed -g --unsafe-perm
npm i pm2@rc -g --unsafe-perm
```


## Utilisation

Après la configuration, il vous faudra ajouter un utilisateur et lancer ezseed

```
ezseed useradd mynewuser
ezseed start
```

Pour plus d'options regardez l'aide `ezseed -h`

## Bugs connus

- rtorrent a un souci avec les noms en majuscules/minuscules
- rtorrent a un souci avec les caractères spéciaux de certains torrents et peut mener à un disfonctionnement d'ezseed
- rtorrent nécessite une configuration supplémentaire d'AutoTools pour déplacer les téléchargements:

![](https://camo.githubusercontent.com/a278375b20071e41ed233b5f6b1e8936222ae0bf/687474703a2f2f7777772e7a75706d6167652e65752f692f687052455238336376472e706e67)
