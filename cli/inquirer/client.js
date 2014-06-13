var inquirer = require('inquirer')
  , i18n = require('i18n')	
  , Promise = require('bluebird')

module.exports = function() {
	return new Promise(function(resolve, reject) {

		inquirer.prompt([{
			type: 'confirm',
			name: 'install_client',
			message: i18n.__('Do you wish to install transmission or rtorrent?'),
			default: true
		}, {
			type: 'list',
			name: 'client',
			message: i18n.__('Which one?'),
			choices: ['rtorrent', 'transmission'],
			when: function(answers) {
				return answers.install_client
			}
		}], function(client) {
			resolve(client)		
		})
	})
}
