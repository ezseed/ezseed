var sample_config = require('../../config/config-sample')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , inquirer = require('inquirer')
  , i18n = require('i18n')
  , Promise = require('bluebird')

module.exports = function() {

	return new Promise(function(resolve, reject) {

		require('local-port').findOpen(3000, 9000, function(err, open_port) {
			if(err) {
				logger.error('We could not find any open port')
				open_port = 8970
			}

			inquirer.prompt(
			{
				type	  : "list",
				name      : "lang",
				message   : "Lang?",
				default   : "en",
				choices   : ["fr","en"]
			}, function(answer) {
				i18n.setLocale(answer.lang)

				inquirer.prompt([{
					type      : "input",
					name      : "home",
					message   : i18n.__("Ezseed home directory"),
        default   : process.env.HOME,
					validate  : function(directory) {
						return fs.existsSync(directory)
					}
				},
				{
					type: 'input',
					name: 'tmp',
					message: i18n.__('Temporary directory'),
        default: process.env.HOME + '/tmp',
					validate  : function(directory) {
						if(!fs.existsSync(directory)) {
							mkdirp.sync(directory)
						}

						return true
					}
				},
				{
					type: 'input',
					name: 'port',
					message: i18n.__('Listening on'),
					default: open_port,
					validate: function(port) {
						return !isNaN(parseInt(port)) && parseInt(port) > 1024
					}
				}], function (answers) {
					answers.lang = answer.lang
					return resolve(answers)
				})

			})
		})
	})
}
