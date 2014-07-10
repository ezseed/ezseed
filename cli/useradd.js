var helper = require('./helpers/promise')
  , db = require('ezseed-database').db
  , logger = require('ezseed-logger')('useradd')
  , config = require('../../lib/config.js')


module.exports = function(opts) {

  require('./inquirer/useradd.js')(opts)
  .then(function(opts) {
    //require config + client installed?

    async.waterfall([
      function(done) {
        return db.user.create(opts, done)
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
      }
    ], function(err) {
      if(err) {
        helper.exit(err)(1)
      }

      //adds the system user
      return
      require('./commands/user')
      .create(opts.username, opts.password)
      .catch(helper.exit('Creating system user.'))
      .then(function() {

        //adds the client user (transmission or rtorrent)
        return
        require('./commands/user')
          .client(opts.client)('useradd', opts.username, opts.password)
          //missing transmission config

  /**
   * var settings = global.app_path + '/scripts/transmission/config/settings.'+username+'.json';

   fs.readFile(settings, function (err, data) {
     if (err) throw err;
     var d = JSON.parse(data);

     //Default settings replacement
     d['ratio-limit-enabled'] = true;
     d['incomplete-dir-enabled'] = true;
     d['incomplete-dir'] = path.join(user_path, username, 'incomplete');
     d['peer-port-random-on-start'] = true;
     d['lpd-enabled'] = true;
     d['peer-socket-tos'] = 'lowcost';
     d['rpc-password'] = password;
     d['rpc-enabled'] = true;
     d['rpc-whitelist-enabled'] = false;
     d['rpc-authentication-required'] = true;
     d['rpc-username'] = username;

     d['download-dir'] = path.join(user_path, username, 'downloads');

     //db.users.count(function (err, count) {
     require(app_path + '/lib/helpers/port').findOpen(9090, function(error, port) {
       if(error)
         logger.error('Port error', error);

       logger.log('Port ' + port + ' ouvert');

       d['rpc-port'] = port;

       fs.writeFileSync(settings, JSON.stringify(d));

       logger.log('Démarage du daemon transmission');

       return require('../../lib/daemon.js')('transmission', 'start', username, next);

     });

   */

      })
      .then(helper.exit('Creating %s', opts.username))
      .catch(helper.exit('Creating %s client', opts.client))

    })


  })
}
