/*
 * 1) config.js
 * 2) remplacer dans ezseed.json
 * 3) créer tmp
 * 4) installer client ? => ezseed install
 * 5) ajouter admin ?
 * 6) gulp + test + pm2 ??
 */

var inquirer = require('inquirer')
  , p = require('path')
  , i18n = require('i18n')
	
i18n.configure({
	locales:['en', 'fr'],
	defaultLocalge: 'en',
	directory: p.resolve(__dirname, '..', 'locales')
})

require('./helpers/ascii').print()

// require('./inquirer/config')(function(answers) {

// })


require('./inquirer/config').then(function(answers) {
	return require('./inquirer/client')
}).then(function(client) {
	console.log(client)
})