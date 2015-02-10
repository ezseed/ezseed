EZSEED (easy seedbox)
===

Toujours en cours de travaux ;)

- [Pré-requis](#pre-requis)
- [Installation](#installation)
  - [Dépendances](#dependances)
  - [ezseed](#ezseed)
- [Mise à jour](#update)
- [Configuration](#configuration)
- [Trucs et astuces](#truc-et-astuces)
  - [SFTP](#sftp)
  - [Streaming](#streaming)
- [Bugs connus](#bugs-connus)

## Pré-requis

  * [Node version manager](https://github.com/creationix/nvm)
  * [Mongodb](http://docs.mongodb.org/manual/installation/)
  * Si aucun serveur n'est présent, [ezseed installera nginx](https://github.com/ezseed/ezseed/blob/master/scripts/server.sh)
  Si vous avez déjà installé un serveur web, ezseed ajoutera sa configuration apache ou nginx (note: apache n'a pas encore été testé)

## Installation

### Dépendances

```
sudo apt-get install gcc-4.7 sudo curl python whois git mongodb
```

#### [Node Version Manager](https://github.com/creationix/nvm)
Installer `nvm` :
```
curl https://raw.githubusercontent.com/creationix/nvm/v0.22.1/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 0.10
nvm alias default 0.10
```

### Ezseed

#### En tant que `root`

```
npm i ezseed -g --unsafe-perm
npm i pm2 -g --unsafe-perm
```

#### ou alors, en tant qu'utilisateur
```
npm i pm2@0.11.0 ezseed -g
```

Ensuite, suivez les instructions de configuration

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
***
@FIXME Pour le moment, il faut lancer la commande ```ezseed useradd mynewuser``` deux fois pour qu'elle soit effective.  
***

Pour plus d'options regardez l'aide `ezseed -h`.

Le fichier de configuration d'ezseed est situé dans `~/.ezseed/config.js`.



## Streaming

### Linux
Le streaming nécessite `avconv` de la librairie [libav](https://libav.org/). Pour l'installer suivez les indications ci-dessous :

```
sudo aptitude install pkg-config gcc-4.7 build-essential libx264-dev libvo-aacenc-dev libvorbis-dev libvpx-dev
wget https://www.libav.org/releases/libav-11.tar.xz
tar xf libav-11.tar.xz
cd libav-11
./configure --enable-libvpx --disable-yasm --enable-gpl --enable-libx264 --enable-libvo-aacenc --enable-version3 --enable-libvorbis
make
sudo make install
```

### OS X
```
brew install libav --with-libvo-aacenc
```

## Trucs et astuces

### [Rsync](https://github.com/ezseed/ezseed/blob/master/docs/fr/rsync.md)
### [Btsync](https://github.com/ezseed/ezseed/blob/master/docs/fr/btsync.md)
### SFTP

Pour un accès en sftp sécurisé éditez `/etc/ssh/sshd_config` puis ajoutez :
```
Match group ezseed
ChrootDirectory /home/%u
X11Forwarding no
AllowTCPForwarding no
ForceCommand internal-sftp
```

## Bugs connus

- Si à l'installation de NVM on vous insulte à propos de locale, faites en tant que `root`:
```
dpkg-reconfigure locales
```
  Puis cocher la ligne `fr_FR.UTF-8 UTF-8`.
  Enfin, définissez la langue à utiliser par défaut par le système en sélectionnant `fr_FR.UTF-8`

  Et relancer l'installation de nvm

- rtorrent a un souci avec les noms en majuscules/minuscules
- rtorrent a un souci avec les caractères spéciaux de certains torrents et peut mener à un disfonctionnement d'ezseed
- rtorrent nécessite une configuration supplémentaire d'AutoTools pour déplacer les téléchargements:

![](https://camo.githubusercontent.com/a278375b20071e41ed233b5f6b1e8936222ae0bf/687474703a2f2f7777772e7a75706d6167652e65752f692f687052455238336376472e706e67)
