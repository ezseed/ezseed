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
  , fs = require('fs')
  , i18n = require('i18n')
  , config = require('../config/config-sample')
  , config_path = p.join(p.resolve(__dirname, '../config'), 'config.js')
	
i18n.configure({
	locales:['en', 'fr'],
	defaultLocalge: 'en',
	directory: p.resolve(__dirname, '..', 'locales')
})

require('./helpers/ascii').print()

require('./inquirer/config')
.then(function(answers) {

	for(var answer in answers) {
		config[answer] = answers[answer]
	}

	if(fs.existsSync(config_path)) {
		logger.error(i18n.__('%s already exists', config_path))
	} else {
		fs.writeFileSync(config_path, 'module.exports = '+JSON.stringify(config))
		logger.log(i18n.__('Config written in %s', config_path))
	}

	logger.info('Installing server...')
	return require('./commands/install').server('localhost:'+answers.port)
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