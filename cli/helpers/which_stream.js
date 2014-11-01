var which = require('which')

var which_stream = function(cb) {

  which('avconv', function(err, path) {
    if(err) {
      return cb(false)
    } else {
      return cb(path)
    }
  })

}

module.exports = which_stream
