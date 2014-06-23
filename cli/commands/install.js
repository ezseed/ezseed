var spawner = require('../helpers/spawner')
  , p = require('path')
  , helper = require('../helpers/promise')
  , scripts_path = '../../scripts'

module.exports = {
	client: function(client) {
		return function() {
			return helper.runasroot(require('ezseed-'+client)('install'))
		}
	},
	server: function(host) {
		return function() {
			return helper.runasroot(p.join(scripts_path, 'server.sh') + ' ' +host)
		}
	}
}
