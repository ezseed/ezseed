var inquirer = require('inquirer')
  , helper = require('../helpers/promise')
  , i18n = require('i18n')
  , Promise = require('bluebird')
  , logger = require('ezseed-logger')('config')
  , p = require('path')
  , HOME = require('../../constants').HOME

module.exports = function() {
  //Array that contains all the commands that'd be executed as root
  //this one is the main configuration directory
  //using mkdir -p to add logs directory
  var runasroot = [
    '[ -d "/usr/local/opt/ezseed/logs" ] || mkdir -p /usr/local/opt/ezseed/logs',
    'chmod -R 777 /usr/local/opt/ezseed'
  ]

  return new Promise(function(resolve, reject) {

    require('local-port').findOpen(3000, 9000, function(err, open_port) {
      if(err) {
        logger.error('We could not find any open port')
        open_port = 8970
      }

      inquirer.prompt([
      {
        type      : "input",
        name      : "home",
        message   : i18n.__("Ezseed home directory"),
        default   : '/home',
        validate  : function(directory) {
          runasroot.push('[ -d "'+directory+'" ] || mkdir -p '+directory)

          return true
        }
      },
      {
        type     : 'input',
        name     : 'tmp',
        message  : i18n.__('Temporary directory'),
        default  : '/usr/local/opt/ezseed/tmp',
        validate : function(directory) {
          runasroot.push('[ -d "'+directory+'" ] || mkdir -p '+directory, 'chmod -R 777 /usr/local/opt/ezseed/tmp')

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
        name     : 'basepath',
        message  : i18n.__('Base path'),
        default  : '/',
        validate : function(basepath) {
          return basepath.charAt(0) == '/' 
        },
        filter: function (basepath) {
          basepath += basepath.charAt(basepath.length - 1) == '/' ? '' : '/'

          return basepath
        }
      },
      {

        type     : 'input',
        name     : 'sslkeys',
        message  : i18n.__("Want to add ssl keys? (ie: './ssl.pem ./ssl.key')"),
        default  : ' ',
        validate : function(ssl) {

          if(ssl === ' ') {
            // return require('../helpers/ssl').create(done)
            runasroot.push("openssl req -new -x509 -days 365 -nodes -out /usr/local/opt/ezseed/ezseed.pem -keyout /usr/local/opt/ezseed/ezseed.key -subj '/CN=ezseed/O=EzSeed/C=FR' 2>/dev/null")
            return true
          }

          ssl = ssl.split(' ')

          function ok(val) { return val.indexOf('.pem') !== -1 || val.indexOf('.key') !== -1}

          if(ok(ssl[0]) && ok(ssl[1])) {
            for(var i in ssl) {
              var k = {path: ssl[i], ext: p.extname(ssl[i])}

              runasroot.push("mv " + k.path + " " + "/usr/local/opt/ezseed/" + k.ext)
            }

            return true
          } else {
            return false
          }

        }
      }], function (answers) {
        answers.lang = i18n.getLocale()

        require('../helpers/which_stream.js')(function(converter) {

          if(converter === false) {
            logger.warn(i18n.__('avconv is not installed'))
          } else {
            logger.info(i18n.__('using %s to encode'), converter)
          }

          answers.converter = converter

          helper.runasroot(runasroot)
          .then(function() {
            resolve(answers)
          })
          .catch(helper.exit('Configuration'))
          })
      })

    })
  })
}
