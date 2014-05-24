/*
 * 1) config.js
 * 2) remplacer dans ezseed.json
 * 3) créer tmp
 * 4) installer client ? => ezseed install
 * 5) ajouter admin ?
 * 6) gulp + test + pm2 ??
 */

var p = require('path')
  , logger = require('../lib/logger')
  , i18n = require('i18n')
	
i18n.configure({
	locales:['en', 'fr'],
	defaultLocalge: 'en',
	directory: p.resolve(__dirname, '..', 'locales')
})

require('./helpers/ascii').print()

require('./inquirer/config')
.then(function(answers) {
	//create config here ?
	logger.log(answers)

	logger.info('Installing server...')
	return require('./commands/install').server('localhost:8970')
})
.catch(function(code) {
	logger.error('server.sh bad exit code', code)
})
.then(function() {
	return require('./inquirer/client')
})
.then(function(client) {
	return require('./commands/install').client(client)
})
.then(function() {
	console.log('test')
})