module.exports =
{
	home: '/home', // the path to users home directory (absolute!)
	tmp: process.env.HOME + '/ezseed/tmp', //the tmp folder path - default to HOME/.ezseed/tmp (absolute!)
	transmission: false, //is transmission installed?
	rtorrent: false, //is rtorrent installed?
	client_link: 'embed', //embed|link do we embed the p2p web interface or should it be openin a new window?
	theme: 'default',
	scrapper: 'tmdb',
	lang: 'en',
	secret: 'really-secret-key'
}
