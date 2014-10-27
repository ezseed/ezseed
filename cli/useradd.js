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
  .then(function(opts) {
    //require config + client installed?

    async.waterfall([
      function(done) {
        return db.user.create(opts, function(err) {
          if(err) {
            logger.error(err)
          }

          return done() //forcing no arguments to prevent async.waterfall to add those
        })
      },
      function(done) {
        //adds the ezseed user
        db.paths.save(
          p.join(config.home, opts.username, 'downloads'),
          {
            username: opts.username,
            default: true
          },
          function(err) {
            if(err) {
              logger.warn(err)
            }

            return done()
          }
        )
      }, function(done) {

        if(opts.client !== 'transmission') {
          return done()
        }

        require('local-port').findOpen(9002, function(err, open_port) {
          if(err) {
            logger.error('We could not find any open port')
            done(err)
          } else {
            opts.transmission_port = open_port
            done()
          }
        })
      }
    ], function(err) {
      if(err) {
        helper.exit(err)(1)
      }

      //adds the system user
      return require('./commands/user')
      .create(opts.username, opts.password)
      .catch(helper.exit(i18n.__('Creating system user')))
      .then(function() {

        debug('Created system user')
        //adds the client user (transmission or rtorrent)
        return require('./commands/user')
          .client(opts.client)('useradd', opts.username, opts.password, opts.transmission_port)
      })
      .catch(helper.exit(i18n.__('Creating %s client', opts.client)))
      .then(function() {
        debug('Created client')
        return helper.condition(opts.client == 'transmission', function() {
          return new Promise(function(resolve, reject) {
            db.user.update(opts.username, {port: opts.transmission_port}, function(err) {
              if(err) {
                return reject(err)
              } else {
                return resolve(0)
              }
            })
          })
        }, function() {
          return helper.next(0)
        })
      })
      .then(function() {
        return require('./commands/daemon').client(opts.client)({command: 'start', user: opts.username})
      })
      .then(helper.exit(i18n.__('Creating %s', opts.username)))
      .catch(helper.exit(i18n.__('Creating %s', opts.username)))

    })


  })
}
