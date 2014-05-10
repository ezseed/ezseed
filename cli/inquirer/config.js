var sample_config = require('../../config/config-sample')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , inquirer = require('inquirer')
  , i18n = require('i18n')
  , Promise = require('bluebird')
	
module.exports = new Promise(function(resolve, reject) {

	inquirer.prompt(
	{
		type	  : "list",
		name      : "lang",
		message   : "Language?",
		default   : "en",
		choices   : ["fr","en"]
	}, function(answer) {
		i18n.setLocale(answer.lang)

		inquirer.prompt([{
			type      : "input",
			name      : "home",
			message   : i18n.__("Ezseed home directory"),
			default   : sample_config.home,
			validate  : function(directory) {
				return fs.existsSync(directory)
			}
		}, 
		{
			type: 'input',
			name: 'tmp',
			message: i18n.__('Temporary directory'),
			default: sample_config.tmp,
			validate  : function(directory) {
				if(!fs.existsSync(directory)) {
					mkdirp.sync(directory)
				}

				return true
			}
		}], function (answers) {
			answers.lang = answer.lang
			return resolve(answers)
		})

	})

})

