//Moves or create ssl keys
var spawner = require('../helpers/spawner')
  , logger = require('ezseed-logger')('system-user')
  , helper = require('../helpers/promise')
  , config = require('../../lib/config.js')
  , p = require('path')
  , os = require('os')

module.exports = {
  create: function(username, password) {
    return helper.condition(os.platform() == 'linux', function() {
      return require('../helpers/quiet_spawner')
        .spawn('grep -c "^'+username+':" /etc/passwd')
        .then(function() {

          if(parseInt(this.data.out[0]) === 1) {
            logger.warn('User %s already exists! Skipping.', username)
            return helper.next()
          } else {

            return helper
             .runasroot(
               'useradd -d '+ p.join(config.home, username) + ' --groups ezseed --password broken ' + username +
               '&& usermod -p $(mkpasswd -H md5 "'+password+'") ' + username
            )
          }

        })
    }, function() {
      logger.warn('System user not supported')
      return helper.next(0)
    })
  },
  password: function(username, password) {
    return helper.condition(os.platform() == 'linux', function() {
      return spawner
        .spawn('usermod -p $(mkpasswd -H md5 "'+password+'") '+username)
    }, function() {
      logger.warn('System user not supported')
      return helper.next(0)
    })
  },
  client: function(client) {
    //where fn (first arg) one of useradd, userdel
    return function() {

      if(client) {

        if(os.platform() !== 'linux') {
          logger.warn('Sadly %s is not supported atm', os.platform())
          return helper.next(0)
        } else {

          var args = [].slice.call(arguments, 0)

          var fn = args.shift()

          return helper.runasroot(require('ezseed-'+client)(fn) +' ' + args.join(' '))
        }
      } else {
        logger.warn('No client specified, skipping')
        return helper.next(0)
      }
    }
  }
}
