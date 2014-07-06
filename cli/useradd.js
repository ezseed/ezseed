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
      .catch(helper.exit('There was an error while creating system user.'))
      .then(function() {

        //adds the client user (transmission or rtorrent)
        return
        require('./commands/user')
          .client(opts.client)('useradd', opts.username, opts.password)

      })
      .then(helper.exit('Creating %s', opts.username))
      .catch(helper.exit('Creating %s client', opts.client))

    })


  })
}
