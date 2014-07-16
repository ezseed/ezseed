var helper = require('./helpers/promise')
  , db = require('ezseed-database').db

module.exports = function(opts) {
  //find client, launch client userdel without deleting content + delete client from ezseed + rm paths that are not watched etc.

  db.user.get(opts.username, function(err, user) {
    if(err) {
      throw err
    } else {

      require('./commands/user')
        .client(opts.client)('userdel', opts.username)
        .then(function() {

          db.user.delete(opts.username, function(err, deleted_paths) {
            if(err) {
              throw err
            } else {
              require('./inquirer/userdel')(opts)
                .then(function() {
                  helper.exit()
                })
            }
          })
        })
        .catch(helper.exit('User client install'))

    }
  })
}
