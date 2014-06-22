//Moves or create ssl keys
var spawner = require('../helpers/spawner')
  , logger = require('ezseed-logger')
  , p = require('path')

module.exports = {
  create: function(done) {
    var cmd = "openssl req -new -x509 -days 365 -nodes -out /usr/local/opt/ezseed/ezseed.pem -keyout /usr/local/opt/ezseed/ezseed.key -subj '/CN=ezseed/O=EzSeed/C=FR'";

    spawner
      .spawn(cmd)
      .then(function() { done(true) })
      .catch(function(code) {
        logger('openssl')
          .error('There was an error while executing: ')
          .error(cmd)
          .error('Please put your keys into /usr/local/opt/ezseed/ezseed.pem|key manually')
        done(true)
      })
  },
  move: function(ssl, done) {
    var cmd = []

    for(var i in ssl) {
      var k = {path: ssl[i], ext: p.extname(ssl[i])}

      cmd.push("mv " + k.path + " " + "/usr/local/opt/ezseed/" + k.ext)
    }

    spawner
      .spawn(cmd)
      .then(function() { done(true) })
      .catch(function(code) {
        logger('ssl keys')
          .error('There was an error while executing: ')
          .error(cmd)
          .error('Please put your keys into /usr/local/opt/ezseed/ezseed.pem|key manually')
        done(true)
      })
  }
}
