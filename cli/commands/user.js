//Moves or create ssl keys
var spawner = require('../helpers/spawner')
  , logger = require('ezseed-logger')('system-user')
  , helper = require('../helpers/promise')
  , config = require('../../lib/config.js')
  , p = require('path')


module.exports = {
  create: function(username, password) {
    return require('../helpers/quiet_spawner')
      .spawn('grep -c "^'+username+':" /etc/passwd')
      .then(function() {

        if(this.data.out[0] === 1) {
          logger.warn('User %s already exists! Skipping.')
          return helper.next()
        } else {

          return helper
           .runasroot(
             'useradd -d '+ p.join(config.home, username) + ' --groups ezseed --password broken ' + username +
             '&& usermod -p $(mkpasswd -H md5 "'+password+'") ' + username
          )
        }

      })
  },
  password: function(username, password) {
    return spawner
      .spawn('usermod -p $(mkpasswd -H md5 "'+password+'") '+username)
  },
  client: function(client) {
    //where fn (first arg) one of useradd, userdel
    return function() {

      if(client) {
        var args = [].slice.call(arguments, 0)

        var fn = args.shift()

        return helper.runasroot(require('ezseed-'+client)(fn) + args.join(' '))
      } else {
        logger.warn('No client specified, skipping')
        return helper.next()
      }
    }
  }
}
