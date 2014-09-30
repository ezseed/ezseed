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
        choices   : opts.paths
      },
      {
        type      : 'confirm',
        name      : 'delete_user',
        default   : false,
        message   : i18n.__('Delete the system user %s?', opts.username)
      }
    ], function(answers) {
      resolve(answers)
    })
  })
}
