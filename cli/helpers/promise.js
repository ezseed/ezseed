var Promise = require('bluebird')
  , logger = require('ezseed-logger')
  , i18n = require('i18n')
  , util = require('util')
  , debug = require('debug')('ezseed:cli')

var sudo_password = ''

module.exports = {
  runasroot: function(cmd) {

    return
    new Promise(function(resolve, reject) {
      inquirer.prompt([{

        type: 'password',
        name: 'sudo',
        message: i18n.__('Please enter your root password'),
        when: function() {
          return sudo_password === ''
        },
        validate: function(pw) {
          var done = this.async()

          require('./spawner')
          .spawn('echo "'+pw+'" | sudo -S su root -c "exit 0"')
          .then(function() {
            done(true)
          })
          .catch(function() {
            done(false)
          })
        }
      }], function(answer) {
        sudo_password = sudo_password === '' ? answer.sudo : sudo_password

        resolve()
      })
    })
    .then(function() {
      return require('./spawner')
      .spawn('echo "'+pw+'" | sudo -S su root -c "'+cmd+'"')
    })

  },
  checkroot: function() {
    if(process.getuid() !== 0) {
      logger().error('Sorry but this needs to be run as root. Exiting.')
      process.exit(1)
    } else {
      return true
    }

  },
  next: function() {
    var args = [].slice.call(arguments)
    return new Promise(function(resolve, reject) { return resolve.apply(null, args) })
  },
  condition: function(condition, success, failed) {

    if(condition)
      return success()
    else
      return typeof failed == 'function' ? failed() : this.next()

  },
  exit: function() {
    var message = util.format.call(util, arguments)

    return function(code) {
      if(code === 0)
        logger('exit').info(message, i18n.__('was successful'))
      else {
        if(code instanceof Error) {
          logger('exit').error(message, i18n.__('failed with error:'))
          logger().error(code.stack)
        } else {
          logger('exit').error(message, i18n.__('failed with code: %s', code))
        }
      }

      process.exit(code)
    }
  }
}
