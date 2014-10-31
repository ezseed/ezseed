var helper = require('./helpers/promise')
  , db = require('ezseed-database').db
  , logger = require('ezseed-logger')('useradd')
  , config = require('../lib/config.js')
  , async = require('async')
  , p = require('path')
  , i18n = require('i18n')
  , Promise = require('bluebird')
  , debug = require('debug')('ezseed:cli:useradd')

module.exports = function(opts) {

  require('./inquirer/useradd.js')(opts)
  //find transmission port
  .then(function() {

    return new Promise(function(resolve, reject) {
      if(opts.client !== 'transmission') {
        return resolve(opts)
      }

      //searching for an open port for the transmission configuration
      require('local-port').findOpen(9002, function(err, open_port) {
        if(err) {
          logger.error('We could not find any open port')
          return reject(err)
        } else {
          debug('Transmission port', open_port)
          opts.port = open_port
          return resolve(opts)
        }
      })

    })
  })
  .catch(helper.exit(i18n.__('Creating system user')))
  .then(function() {
    //@todo require config + client installed?
    //create user in database
    return new Promise(function(resolve, reject) {

      db.user.create(opts, function(err) {
        if(err) {
          return reject(err, opts)
        }

        debug('db user created', opts)

        return resolve(opts)

      })

    })
  })
  .catch(helper.exit(i18n.__('Creating %s', opts.username)))
  //save the download path
  .then(function() {

    return new Promise(function(resolve, reject) {

     //adds the download path to the user
     db.paths.save(
       p.join(config.home, opts.username, 'downloads'),
       {
         username: opts.username,
         default: true
       },
       function(err) {
         //this can be a user mistake, path is already watched
         if(err) {
           logger.warn(err)
         }

         debug('Path saved', opts)

         return resolve(opts)

      })

    })
  })
  //add system user
  .then(function() {
    return require('./commands/user')
      .create(opts.username, opts.password)
  })
  .catch(helper.exit(i18n.__('Creating system user')))
   //adds the client user (transmission or rtorrent)
  .then(function() {
    return require('./commands/user')
      .client(opts.client)('useradd', opts.username, opts.password, opts.port)
  })
  .catch(helper.exit(i18n.__('Creating %s client', opts.client)))
  .then(function() {
    return require('./commands/daemon').client(opts.client)({command: 'start', user: opts.username})
  })
  .then(helper.exit(i18n.__('Creating %s', opts.username)))
  .catch(helper.exit(i18n.__('Creating %s', opts.username)))

}
