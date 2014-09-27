var inquirer = require('inquirer')
  , Promise = require('bluebird')
  , logger = require('ezseed-logger')('userdel')
  , i18n = require('i18n')
  , async = require('async')
  , rimraf = require('rimraf')

module.exports = function(opts) {
  return new Promise(function(resolve, reject) {

    inquirer.prompt([
      {
        type      : 'checkbox',
        name      : 'deleted_paths',
        message   :  i18n.__('These directories will be removed:'),
        default   : [],
        choices   : opts.paths,
        validate: function(paths) {
          var done = this.async()

          if(paths.length == 0)
            done()

          async.each(paths, rimraf, function(err) {
            if(err)
              logger.error(err)

            done()
          })

        }
      },
      {
        type      : 'confirm',
        name      : 'delete_user',
        default   : false,
        message   : i18n.__('Delete the system user %s?', opts.username),
        validate  : function(v) {
          var done = this.async()

          require('../helpers/spawner')
          .spawn('userdel '+ opts.username)
          .then(function() {
            done()
          })
          .catch(function() {
            logger.error(i18n.__('Deleting the user failed'))
            done()
          })
        },
      }
    ], function(answers) {
      resolve()
    })
  })
}
