var fs = require('fs')
  , mkdirp = require('mkdirp')
  , inquirer = require('inquirer')
  , helper = require('../helpers/promise')
  , i18n = require('i18n')
  , Promise = require('bluebird')
  , logger = require('ezseed-logger')('config')

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
          var done = this.async()

          helper
          .runasroot('[ -d "'+directory+'" ] || mkdir -p '+directory)
          .then(function() {
            done(true)
          })
          .catch(function() {
            done(false)
          })
        }
      },
      {
        type     : 'input',
        name     : 'tmp',
        message  : i18n.__('Temporary directory'),
        default  : process.env.HOME + '/tmp',
        validate : function(directory) {
          var done = this.async()

          helper
          .runasroot('[ -d "'+directory+'" ] || mkdir -p '+directory)
          .then(function() {

            logger.info('Creating ezssed configuration directory: /usr/local/opt/ezseed')

            return
            helper
            .runasroot('[ -d "/usr/local/opt/ezseed" ] || mkdir /usr/local/opt/ezseed')
          })
          .catch(function() {
            done(false)
          })
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
        type     : 'input',
        name     : 'port',
        message  : i18n.__('Listening on'),
        default  : open_port,
        validate : function(port) {
          return !isNaN(parseInt(port)) && parseInt(port) > 1024
        }
      },
      {

        type     : 'input',
        name     : 'sslkeys',
        message  : i18n.__('Want to add ssl keys? (ie: "./ssl.pem ./ssl.key"):'),
        default  : ' ',
        validate : function(ssl) {

          var done = this.async()

          if(ssl === ' ') {
            return require('../helpers/ssl').create(done)
          }

          ssl = ssl.split(' ')

          function ok(val) { return val.indexOf('.pem') !== -1 || val.indexOf('.key') !== -1}

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
