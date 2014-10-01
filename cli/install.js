var p = require('path')
  , logger = require('ezseed-logger')()
  , fs = require('fs')
  , i18n = require('i18n')
  , config = require('../config/config-sample')
  , constants = require('../constants')
  , config_path = constants.CONFIG_FILE
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
    config['lang'] = lang

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
          logger.warn(i18n.__('%s already exists - use force to replace, skipping', config_path))
          return helper.next()
        } else {
          logger.warn(i18n.__('Overriding %s', config_path))
        }
      }

      fs.writeFileSync(config_path, 'module.exports = '+JSON.stringify(config, undefined, 2), {mode: 775})
      logger.info(i18n.__('Configuration saved in %s', config_path))

    }

    return helper.next()
  })
  //Write pm2 json configuration
  .then(function() {

    if(!opts.skipconfig) {

      var root = p.resolve(__dirname, '../'),
        ezseed_pm2 = p.join(constants.HOME, 'ezseed.json')

      if(fs.existsSync(ezseed_pm2) && !opts.force) {
        logger.warn(i18n.__('%s already exists - use force to replace, skipping', ezseed_pm2))
        return helper.next()
      }

      var json = {
        apps: [{
          name: 'ezseed',
          script: p.join(root, 'server.js'),
          out_file: '/usr/local/opt/ezseed/logs/ezseed-out.log',
          error_file: '/usr/local/opt/ezseed/logs/ezseed-error.log',
          exec_mode: 'fork_mode'
        }, 
        {
          name: 'watcher',
          script: p.join(root, 'watcher.js'),
          out_file: '/usr/local/opt/ezseed/logs/watcher-out.log',
          error_file: '/usr/local/opt/ezseed/logs/wathcer-error.log',
          exec_mode: 'fork_mode'
        }]
      } 

      fs.writeFileSync(ezseed_pm2, JSON.stringify(json, undefined, 2))

      logger.info(i18n.__('Ezseed json declaration saved'))
    }

    return helper.next()
  })

  .then(function() {
     if(opts.new) {
      logger.info(i18n.__('Installation complete!'))
      logger.info(i18n.__("Please run 'ezseed useradd username' to add a user"))
      logger.info(i18n.__("To launch ezseed run 'ezseed start'"))
      return helper.exit('Installation')(0)
    } else {
      return helper.exit('Configuration')(0)
    }
  })
  .catch(helper.exit(opts.new ? 'Installation' : 'Configuration'))

}
