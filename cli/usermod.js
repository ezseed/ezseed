var db = require('ezseed-database')
  , helper = require('./helpers/promise')
  , logger = require('ezseed-logger')('usermod')

module.exports = function(opts) {
  var u = {}

  u[opts.key] = opts.value

  db.user.update(opts.username, u, function(err, user) {
    if(err) {
      throw err
    } else {

      if(opts.key == 'password') {
        require('./commands/daemon')(user.client)({user: user.username, command: 'stop'})
        .then(function() {
          return
            require('./commands/user')
             .client(opts.client)('passwd', opts.username, opts.password)
        })
        .then(function() {
          require('./commands/daemon')(user.client)({user: user.username, command: 'start'})
        })
        .catch(helper.exit('usermod'))

      } else {
        logger.warn('Only database %s has been updated')
        helper.exit('Usermod')(0)
      }
    }

  })
}
