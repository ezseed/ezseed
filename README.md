EZSEED (easy seedbox)
===

Still a work in progress ;)

### [README en français](https://github.com/ezseed/ezseed/tree/master/docs/fr)

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
sudo aptitude install gcc-4.7 sudo curl python

# nvm
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

#### As user
```
npm i pm2@rc ezseed -g
```

#### As root
```
npm i ezseed -g --unsafe-perm
npm i pm2@rc -g --unsafe-perm
```

Then, follow the configuration instructions.

## Usage

After the configuration process, you'll need to add an user and start ezseed:

```
ezseed useradd mynewuser
ezseed start
```

For more options look at `ezseed -h`

## Known Issues

- rtorrent has issues with upper/lower case usernames
- rtorrent has issues with torrent special caracters and could break ezseed watcher process
- rtorrent needs an Autotools configuration to move downloaded torrents:

![](https://camo.githubusercontent.com/a278375b20071e41ed233b5f6b1e8936222ae0bf/687474703a2f2f7777772e7a75706d6167652e65752f692f687052455238336376472e706e67)
