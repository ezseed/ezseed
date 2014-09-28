var spawner = require('../helpers/spawner')
  , helper = require('../helpers/promise')
  , logger = require('ezseed-logger')('daemon')
  , db = require('ezseed-database').db
  , p = require('path')

module.exports = {
  client: function(client) {
    return function(opts) {

      try {
        var daemon = require('ezseed-'+client)('daemon')
      } catch(e) {
        logger.warn('Client %s not supported', client)
        return helper.next(0)
      }

      if(opts.user) {
          return helper.runasroot(daemon + ' ' + [opts.command, opts.user].join(' '))
      } else {
        db.users.get(function(err, docs) {
          if(err) throw err

          var num = docs.length, users = []

          while(num--) {
            users.push(daemon + ' ' + [opts.command, docs[num].username].join(' '))
          }

          return helper.runasroot(users.join(' && '))

        })
      }
    }
  },
  ezseed: function(command) {
    return function(options) {

      var pm2 = require('pm2')
      var json = p.resolve(__dirname, '../../ezseed.json')
      var exit = 'Ezseed '+command

      pm2.connect(function(err) {
        if(err) {
          logger.error('Error while connecting with pm2', err)
          return helper.exit(exit)(1)
        }

        switch(command) {
          case 'start':
            pm2.startJson(json, {}, null, function(err) {
              if(err) {
                logger.error('Error while starting process', err)
              }

              return helper.exit(exit)(err ? 1 : 0)
            })
            break;
          case 'stop':
            pm2.stop('ezseed', function(err) {
              if(err) {
                logger.error('Error while stopping ezseed', err)
              }

              pm2.stop('watcher', function(err) {
                if(err) {
                  logger.error('Error while stopping watcher', err)
                }

                return helper.exit(exit)(err ? 1 : 0)
              })
            })
            break;
          case 'restart':
            pm2.restart('ezseed', function(err) {
              if(err) {
                logger.error('Error while restarting ezseed', err)
              }

              pm2.restart('watcher', function(err) {
                if(err) {
                  logger.error('Error while restarting watcher', err)
                }

                return helper.exit(exit)(err ? 1 : 0)
              })
            })
            break;
          default:
            logger.warn(i18n.__('No such command %s', command))
            return helper.exit(exit)(1)
        }

      })
    }
     
  }

}
