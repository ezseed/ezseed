/*
 * 1) config.js
 * 2) remplacer dans ezseed.json
 * 3) créer tmp
 * 4) installer client ? => ezseed install
 * 5) ajouter admin ?
 * 6) gulp + test + pm2 ??
 */

var p = require('path')
  , logger = require('ezseed-logger')()
  , fs = require('fs')
  , i18n = require('i18n')
  , config = require('../config/config-sample')
  , config_path = p.join(p.resolve(__dirname, '../config'), 'config.js')
  , helper = require('./helpers/promise')

module.exports = function(opts) {
  if(opts.new) {
    require('./helpers/ascii').print()
    console.log('Welcome to ezseed!')
  }

  //ask configuration questions
  require('./inquirer/lang')()
  .then(function(lang) {

    i18n.setLocale(lang)

    return helper.condition(!opts.skipconfig, require('./inquirer/config'))

  })
  .then(function(answers) {

    var server

    if(answers) {
      for(var answer in answers) {
        config[answer] = answers[answer]
      }

      server = '127.0.0.1:'+answers.port
    }

    return helper.condition(!opts.skipserver, require('./commands/install').server(server))
  })
  .catch(helper.exit(i18n.__('Server installation')))

  //ask client questions
  .then(function() {
    return helper.condition(!opts.skipclient, require('./inquirer/client'))
  })
  .then(function(client) {
    //if opts.skipclient
    if(client === undefined || opts.skipclient)
      client = {install_client: false}

    return helper.condition(client.install_client, require('./commands/install').client(client.client))
  })
  .catch(helper.exit(i18n.__('Client installation')))

  //Write configuration
  .then(function() {

    if(!opts.skipconfig) {

      if(fs.existsSync(config_path)) {
        if(!opts.force) {
          throw new Error(i18n.__('%s already exists - use force to replace, skipping', config_path))
        } else {
          logger.warn(i18n.__('Overriding %s', config_path))
        }
      }

      fs.writeFileSync(config_path, 'module.exports = '+JSON.stringify(config, undefined, 2), {mode: 664})
      logger.info(i18n.__('Configuration saved in %s', config_path))

    }

    return helper.next()
  })
  .then(function() {
     if(opts.new) {
      logger.info(i18n.__('Please run "ezseed useradd username"'))
      return helper.exit('Installation')(0)
    } else {
      return helper.exit('Configuration')(0)
    }
  })
  .catch(helper.exit(opts.new ? 'Installation' : 'Configuration'))

}
