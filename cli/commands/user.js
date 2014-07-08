//Moves or create ssl keys
var spawner = require('../helpers/spawner')
  , logger = require('ezseed-logger')('system-user')
  , helper = require('../helpers/promise')
  , config = require('../../lib/config.js')
  , p = require('path')

var spawn = new require('promise-spawner')({out: ''})

module.exports = {
  create: function(username, password) {
    return
      spawn
      .spawn('grep -c "^'+username+':" /etc/passwd')
      .then(function() {

        if(this.data.out[0] === 1) {
          logger.warn('User %s already exists! Skipping.')
          return helper.next()
        } else {

          return helper
           .runasroot(
             'useradd --home=dir '+ p.join(config.home, username) + ' --groups ezseed --password broken ' + username +
             '&& usermod -p $(mkpassswd -H md5 "'+password+'") ' + username
          )
        }

      })
  },
  password: function(username, password) {
    return
      spawner
      .spawn('usermod -p $(mkpasswd -H md5 "'+password+'") '+username)
  },
  client: function(client) {
    //where fn one of useradd, userdel
    return function() {
      var args = [].slice.call(arguments, 0)

      var fn = args.shift()

      return helper.runasroot(require('ezseed-'+client)(fn) + args.join(' '))
    }
  }
}
