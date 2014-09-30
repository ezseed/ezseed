var Promise = require('bluebird')
  , logger = require('ezseed-logger')
  , i18n = require('i18n')
  , util = require('util')
  , inquirer = require('inquirer')
  , debug = require('debug')('ezseed:cli:promise')

var sudo_password = ''

module.exports = {
  runasroot: function(cmd) {
    cmd = cmd instanceof Array ? cmd.join(' && ') : cmd;

    return new Promise(function(resolve, reject) {
      inquirer.prompt([{
        type: 'password',
        name: 'sudo',
        message: i18n.__('Please enter your root password'),
        when: function() {
          return sudo_password === ''
        },
        validate: function(pw) {
          var done = this.async()

          require('./quiet_spawner')
          .spawn('echo "'+pw+'" | sudo -S whoami')
          .then(function() {
            if(this.data.out[0] == 'root') {
              done(true)
            } else {
              logger('root').error('You logged yourself as %s - please send an issue on github about this', this.data[0])

              setTimeout(function() {
                done(false)
              }, 100)
            }
          })
          .catch(function() {
            done(false)
          })
        }
      }], function(answer) {
        sudo_password = sudo_password === '' ? answer.sudo : sudo_password

        resolve(sudo_password)
      })
    })
    .then(function() {
      debug('Command executed by root: ', cmd)
      return require('./spawner')
      .spawn('echo "'+sudo_password+'" | sudo -S su - root -c "'+cmd+'"')
    })
  },
  //@depreceated
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
    var message = util.format.apply(util, arguments)

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
