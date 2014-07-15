var spawner = require('../helpers/spawner')
  , helper = require('../helpers/promise')
  , db = require('ezseed-database').db

module.exports = {
  client: function(client) {
    return function(opts) {
      // helper.checkroot()

      if(opts.user) {
			  return helper.runasroot(require('ezseed-'+client)('daemon') + ' ' + [opts.command, opts.user].join(' '))
      } else {
        db.users.get(function(err, docs) {
          if(err) throw err

          var num = docs.length, users = []

          while(num--) {
            users.push(require('ezseed-'+client)('daemon') + ' ' + [opts.command, docs[num].username].join(' '))
          }

          return helper.runasroot(users.join(' && '))

        })
      }
    }
  },
  ezseed: function(command) {

  }

}
