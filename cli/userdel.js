var helper = require('./helpers/promise')
  , db = require('ezseed-database').db
  , logger = require('ezseed-logger')('userdel')

module.exports = function(opts) {
  //find client, launch client userdel without deleting content + delete client from ezseed + rm paths that are not watched etc.

  db.user.get(opts.username, function(err, user) {
    if(err && !opts.force) {
      throw err
    } else {

      if(err) logger.error(err.message)

      if(user.client && !opts.client) {
        opts.client = user.client
      }

      require('./commands/user')
        .client(opts.client)('userdel', opts.username)
        .then(function() {

          db.user.delete(opts.username, function(err, deleted_paths) {
            if(err && !opts.force) {
              throw err
            } else {

              if(err) logger.error(err.message)

              opts.paths = deleted_paths || ['/home/'+opts.username]

              require('./inquirer/userdel')(opts)
              .then(function(answers) {

                for(var i in answers.deleted_paths) {
                  answers.deleted_paths[i] = 'rm -rf '+answers.deleted_paths
                }

                if(answers.delete_user === true) {
                  answers.deleted_paths.push('userdel '+ opts.username)
                }

                return helper
                  .runasroot(answers.deleted_paths)
              })
              .then(helper.exit('Userdel'))
              .catch(helper.exit('Userdel'))
            }
          })
        })
        .catch(helper.exit('User client install'))

    }
  })
}
