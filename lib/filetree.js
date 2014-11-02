var fs = require('fs')
var db = require('ezseed-database').user
var mime = require('mime')
var p = require('path')

// var fileTree 
module.exports = function(req, res, next) {
  fs.readdir(req.query.path, function(err, files) {
    if(err) {
      return res.status(500).send({error: err}).end()
    }

    res.json(
      files
      //remove hidden
      .filter(function(v) { return !v || !/^\./.test(v) })
      .map(function(file) { 
        var absolute = p.join(req.query.path, file)
        var stat = fs.statSync(absolute)
        var f = {name: file, size: stat.size, path: absolute, prevDir: p.dirname(absolute), ext: p.extname(absolute)}

        if(stat.isDirectory() && !/\.app/i.test(file)) {
          f.prevDir = absolute
          f.prevDirRelative = file
          // f.type = 'folder'
        } else {
          var m = mime.lookup(absolute)
          f.type = m.split('/')[0]

          if(!~['application', 'video', 'audio', 'image', 'text'].indexOf(f.type)) {
            f.type = 'application'
          }

        }

        return f
      })
    )
  })
}
