### Synchronisation via BtSync (Multi-platerforme, User-friendly)

Installation de btsync (effectuer en tant que root/sudo)
```
#Ajout et paramétrage des dépots
apt-key adv --keyserver keys.gnupg.net --recv-keys 6BF18B15
CODENAME=$(lsb_release -cs | sed -n '/lucid\|precise\|quantal\|raring\|saucy\|trusty\|squeeze\|wheezy\|jessie\|sid/p')
echo "" >> /etc/apt/sources.list
echo "#### BitTorrent Sync - see: http://forum.bittorrent.com/topic/18974-debian-and-ubuntu-server-packages-for-bittorrent-sync-121-1/" >> /etc/apt/sources.list
echo "## Run this command: apt-key adv --keyserver keys.gnupg.net --recv-keys 6BF18B15" >> /etc/apt/sources.list
echo "deb http://debian.yeasoft.net/btsync ${CODENAME:-sid} main" >> /etc/apt/sources.list
echo "deb-src http://debian.yeasoft.net/btsync ${CODENAME:-sid} main" >> /etc/apt/sources.list
unset CODENAME
#Installation du paquet
apt-get update
apt-get -y install btsync 
```

Configuration

Pour autoriser à btsync l'acces en écriture a votre dossier de téléchargement :
```
#Il suffit de l'ajouter au groupe du propriétaire du dossier
sudo usermod -aG 'utilisateur' btsync

#Puis autoriser RWX au groupe
sudo chmod -R 775 /home/'utilisateur'/downloads

#Il faut ensuite de relancer le serveur pour que ces modifications soient prises en compte
sudo service btsync restart
```

Edition de la configuration (changement du port,...)
```
sudo dpkg-reconfigure btsync
````
