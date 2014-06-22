var spawner = require('../helpers/spawner')
  , p = require('path')
  , helper = require('../helpers/promise')
  , scripts_path = '../../scripts'

module.exports = {
	client: function(client) {
		return function() {
			helper.checkroot()
			return spawner.spawn(require('ezseed-'+client)('install'))
		}
	},
	server: function(host) {
		return function() {
			helper.checkroot()
			return spawner.spawn(p.join(scripts_path, 'server.sh') + ' ' +host)
		}
	}
}
