var db = require('ezseed-database').db
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
        require('./commands/daemon').client(user.client)({user: user.username, command: 'stop'})
        .then(function() {
          return require('./commands/user')
          .client(user.client)('passwd', user.username, opts.password)
        })
        .then(function() {
          return require('./commands/user')
          .password(user.username, opts.password)
        })
        .then(function() {
          return require('./commands/daemon').client(user.client)({user: user.username, command: 'start'})
        })
        .catch(helper.exit('usermod'))
        .then(helper.exit('Usermod'))

      } else {
        logger.warn('Only database %s has been updated', opts.key)
        helper.exit('Usermod')(0)
      }
    }

  })
}
