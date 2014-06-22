var Spawner = require('promise-spawner')
  , chalk = require('chalk')
  , p = require('path')
  , helper = require('../helpers/promise')
  , scripts_path = p.resolve(__dirname, '../../scripts')

var spawner = new Spawner({
	out: chalk.blue('info') + ': ',
	err: chalk.red('error') + ': '
})

spawner.out.pipe(process.stdout)
spawner.err.pipe(process.stderr)

module.exports = {
	client: function(client) {
		return function() {
			helper.checkroot()
			return spawner.spawn(p.join(scripts_path, client, 'install.sh'))
		}
	},
	server: function(host) {
		return function() {
			helper.checkroot()
			return spawner.spawn(p.join(scripts_path, 'server.sh') + ' ' +host)
		}
	}
}
