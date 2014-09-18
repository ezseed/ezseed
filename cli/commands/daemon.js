var spawner = require('../helpers/spawner')
  , helper = require('../helpers/promise')
  , logger = require('ezseed-logger')('daemon')
  , db = require('ezseed-database').db

module.exports = {
  client: function(client) {
    return function(opts) {
      // helper.checkroot()

      try {
        var daemon = require('ezseed-'+client)('daemon')
      } catch(e) {
        logger.warn('Client %s not supported', client)
        return helper.next(0)
      }

      if(opts.user) {
          return helper.runasroot(daemon + ' ' + [opts.command, opts.user].join(' '))
      } else {
        db.users.get(function(err, docs) {
          if(err) throw err

          var num = docs.length, users = []

          while(num--) {
            users.push(daemon + ' ' + [opts.command, docs[num].username].join(' '))
          }

          return helper.runasroot(users.join(' && '))

        })
      }
    }
  },
  ezseed: function(command) {

  }

}
