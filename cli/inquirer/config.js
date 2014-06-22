var fs = require('fs')
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

          //this is forced - see below
          if(!fs.existsSync('/usr/local/opt/ezseed')) {
            mkdirp.sync('/usr/local/opt/ezseed')
          }

					return true
				}
			},
      //to add this feature we would need to update shells to add the values
      // in vhosts

      // {
      //   type: 'input',
      //   name: 'tmp',
      //   message: i18n.__('Installation folder'),
      //   default: '/usr/local/opt/ezseed',
      //   validate  : function(directory) {
      //     if(!fs.existsSync(directory)) {
      //       mkdirp.sync(directory)
      //     }
      //
      //     return true
      //   }
      // },
			{
				type: 'input',
				name: 'port',
				message: i18n.__('Listening on'),
				default: open_port,
				validate: function(port) {
					return !isNaN(parseInt(port)) && parseInt(port) > 1024
				}
			},
      {
        type: 'input',
        name: 'sslkeys',
        message: i18n.__('Want to add ssl keys? "./ssl.pem ./ssl.key"'),
        default: '',
        validate: function(ssl) {

          var done = this.async()

          if(ssl.length === '') {
            return require('../helpers/ssl').create(done)
          }

          ssl = ssl.split(' ')

          function ok(val) { return val == '.pem' || val == '.key'}

          if(ok(ssl[0]) && ok(ssl[1])) {
            return require('../helpers/ssl').move(ssl, done)
          } else {
            return done(false)
          }

        }
      }], function (answers) {
				answers.lang = answer.lang
				return resolve(answers)
			})

		})
	})
}
