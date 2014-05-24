var Spawner = require('promise-spawner')
  , chalk = require('chalk')
  , p = require('path')
  , logger = require('../../lib/logger')
  , scripts_path = p.resolve(__dirname, '../../scripts')

var spawner = new Spawner({
	out: chalk.blue('info') + ': ',
	err: chalk.red('error') + ': '
})

spawner.out.pipe(process.stdout)
spawner.err.pipe(process.stderr)

module.exports = {
	client: function(client) {
		logger.log(client)
	},
	server: function(host) { 
		return spawner.spawn(p.join(scripts_path, 'server.sh '+host))
	}
} 