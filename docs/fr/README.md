EZSEED (easy seedbox)
===

Toujours en cours de travaux ;)

- [Prérequis](#pre-requis)
  - [Nodejs](#nodejs)
  - [MongoDB](#mongodb)
  - [Serveur](#serveur)
- [Installation](#installation)
  - [Dépendances](#dependances)
  - [ezseed](#ezseed)
- [Update](#update)
- [Configuration](#configuration)
- [SFTP](#sftp)
- [Streaming](#streaming)
- [Bugs connus](#bugs-connus)
- [Trucs et astuces](#truc-et-astuces)

## Pré-requis

### Nodejs
[Node version manager](https://github.com/creationix/nvm) est recommandé

### MongoDB
[Instructions d'installation](http://docs.mongodb.org/manual/installation/)

### Serveur
Si aucun serveur n'est présent, [ezseed installera nginx](https://github.com/ezseed/ezseed/blob/master/scripts/server.sh)
Si vous avez déjà installé un serveur web, ezseed ajoutera sa configuration apache ou nginx (note: apache n'a pas encore été testé)

## Installation

### Dépendances

```
sudo aptitude install gcc-4.7 sudo curl python whois git

# nvm - nodejs
[Instructions here](https://github.com/creationix/nvm/blob/master/README.markdown#installation)

# mongodb
[Debian instructions here](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-debian/)
```

### Ezseed

#### Soit en tant que `root`

```
npm install ezseed pm2 -g --unsafe-perm
```

#### soit en tant qu'utilisateur
```
npm install pm2 ezseed -g
```

Ensuite, suivez les instructions de configuration et démarrez ezseed `ezseed start`.

## Update

```
npm update ezseed -g [--unsafe-perm]
ezseed restart
```

## Configuration

Après la configuration, il vous faudra ajouter un utilisateur et lancer ezseed

```
ezseed useradd mynewuser
ezseed start
ezseed transmission start
```

Pour plus d'options regardez l'aide `ezseed -h`.

Le fichier de configuration d'ezseed est situé dans `~/.ezseed/config.js`.

## SFTP

Pour un accès en sftp sécurisé éditez `/etc/ssh/sshd_config` puis ajoutez :
```
  Match group ezseed
    ChrootDirectory /home/%u
    X11Forwarding no
    AllowTCPForwarding no
    ForceCommand internal-sftp
```

## Streaming

Le streaming nécessite `avconv` de la librairie [libav](https://libav.org/). Pour l'installer suivez les indications ci-dessous : 

```
❯ sudo aptitude install pkg-config gcc-4.7 build-essential libx264-dev libvo-aacenc-dev libvorbis-dev libvpx-dev
❯ wget https://www.libav.org/releases/libav-11.tar.xz
❯ tar xf libav-11.tar.xz
❯ cd libav-11
❯ ./configure --enable-libvpx --disable-yasm --enable-gpl --enable-libx264 --enable-libvo-aacenc --enable-version3 --enable-libvorbis
❯ make
❯ sudo make install
```

### OS X
```
❯ brew install libav --with-libvo-aacenc
```

## Bugs connus

- rtorrent a un souci avec les noms en majuscules/minuscules
- rtorrent a un souci avec les caractères spéciaux de certains torrents et peut mener à un disfonctionnement d'ezseed
- rtorrent nécessite une configuration supplémentaire d'AutoTools pour déplacer les téléchargements:

![](https://camo.githubusercontent.com/a278375b20071e41ed233b5f6b1e8936222ae0bf/687474703a2f2f7777772e7a75706d6167652e65752f692f687052455238336376472e706e67)

## Trucs et astuces

### [Rsync](https://github.com/ezseed/ezseed/blob/master/docs/fr/rsync.md)
### [Btsync](https://github.com/ezseed/ezseed/blob/master/docs/fr/btsync.md)
