EZSEED (easy seedbox)
===

Still a work in progress ;)

- [Requirements](#requirements)
  - [Nodejs](#nodejs)
  - [MongoDB](#mongodb)
  - [Server](#server)
- [Installation](#installation)
  - [Dependencies](#dependencies)
  - [ezseed](#ezseed)
- [Update](#update)
- [Configuration](#configuration)
- [SFTP](#sftp)
- [Streaming](#streaming)
- [Known Issues](#known-issues)

## Requirements

### Nodejs
[Node version manager](https://github.com/creationix/nvm) is recommended

### MongoDB
[Installation instruction](http://docs.mongodb.org/manual/installation/)

### Server
If no server is provided, [ezseed will install nginx](https://github.com/ezseed/ezseed/blob/master/scripts/server.sh)
If you have already a server installed, ezseed is apache or nginx friendly (note apache hasn't been tested yet)

## Installation 

### Dependencies

```
sudo aptitude install gcc-4.7 sudo curl python whois git

# nvm - nodejs
[Instructions here](https://github.com/creationix/nvm/blob/master/README.markdown#installation)

# mongodb
[Debian instructions here](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-debian/)
```

### Ezseed

#### As user
```
npm i ezseed pm2 -g
```

#### As root
```
npm i ezseed -g --unsafe-perm
npm i pm2 -g --unsafe-perm
```

Then, follow the configuration instructions.

## Update

```
npm update ezseed -g [--unsafe-perm]
ezseed restart
```

## Configuration

After the configuration process, you'll need to add an user and start ezseed:

```
ezseed useradd mynewuser
ezseed start
ezseed transmission start
```

For more options look at `ezseed -h`.

The configuration file is located in `~/.ezseed/config.js`.

## SFTP

For a secure sftp access per user edit `/etc/ssh/sshd_config` by adding:
```
  Match group ezseed
    ChrootDirectory /home/%u
    X11Forwarding no
    AllowTCPForwarding no
    ForceCommand internal-sftp
```

Users will be chrooted.

## Streaming

Streaming requires `avconv` from [libav](https://libav.org/). It's optional and if needed should be installed like this:

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

## Known Issues

- rtorrent has issues with upper/lower case usernames
- rtorrent has issues with torrent special caracters and could break ezseed watcher process
- rtorrent needs an Autotools configuration to move downloaded torrents:

![](https://camo.githubusercontent.com/a278375b20071e41ed233b5f6b1e8936222ae0bf/687474703a2f2f7777772e7a75706d6167652e65752f692f687052455238336376472e706e67)
