module.exports =
{
	home: '/home', // the path to users home directory (absolute!)
	tmp: process.env.HOME + '/.ezseed/tmp', //the tmp folder path - default to HOME/.ezseed/tmp (absolute!)
        watcher: 'unix:///usr/local/opt/ezseed/watcher.sock',
        watcher_rpc: 'unix:///usr/local/opt/ezseed/watcher_rpc.sock',
	transmission: false, //is transmission installed?
	rtorrent: false, //is rtorrent installed?
	client_link: 'embed', //embed|link do we embed the p2p web interface or should it be openin a new window?
	theme: 'ezseed-web',
	scrapper: 'tmdb',
	lang: 'en',
	secret: 'really-secret-key',
        base: '/' //ezseed base path
}
