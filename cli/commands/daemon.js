var spawner = require('../helpers/spawner')
  , helper = require('../helpers/promise')
  , logger = require('ezseed-logger')('daemon')
  , db = require('ezseed-database').db
  , p = require('path')
  , fs = require('fs')
  , exec = require('child_process').exec
  , Promise = require('bluebird')

module.exports = {
  client: function(client) {
    return function(opts) {

      try {
        var daemon = require('ezseed-'+client)('daemon')
      } catch(e) {
        logger.warn('Client %s not supported', client)
        return helper.next(0)
      }

      return helper.condition(!opts.user, function() {
        return new Promise(function(resolve) {
          db.users.get(function(err, docs) {
            resolve(docs)
          })
        })
      })
      .then(function(docs) {
        if(opts.user) {
          return helper.runasroot(daemon + ' ' + [opts.command, opts.user].join(' '))
        } else {
          var num = docs.length, users = []

          while(num--) {
            if(docs[num].client == client) {
              users.push(daemon + ' ' + [opts.command, docs[num].username].join(' '))
            }
          }

          return helper.runasroot(users)
        }
      })
    }
  },
  ezseed: function(command) {
    return function(options) {

      var pm2 = require('pm2')

      var json = p.join(require('../../constants').HOME, 'ezseed.json')
      var exit = 'Ezseed '+command

      //pm2 does not init itself on connect
      var pm2_bin = p.resolve(__dirname, '../../', 'node_modules', 'pm2', 'bin', 'pm2')

      if(!fs.existsSync(pm2_bin)) {
        pm2_bin = 'pm2'
      }

      exec(pm2_bin, ['-v'], function() {
        pm2.connect(function(err) {
          if(err) {
            logger.error('Error while connecting with pm2', err)
            return helper.exit(exit)(1)
          }

          switch(command) {
            case 'start':
              pm2.start(json, {}, null, function(err) {
                if(err) {
                  logger.error('Error while starting process', err)
                } else {
                  pm2.dump(function(err) {
                    if(err) {
                      logger.error('Error while dumping pm2', err)
                    }

                    logger.info('Tip: Launch "pm2 startup ubuntu"')
                    return helper.exit(exit)(err ? 1 : 0)
                  })
                }
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
      })
    }
     
  }

}
