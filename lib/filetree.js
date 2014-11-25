var fs = require('fs')
var db = require('ezseed-database').user
var mime = require('mime')
var p = require('path')
var logger = require('ezseed-logger')('filetree')

var noDotFiles = function(x) {
  return x[0] !== '.'
}

var dirSize =  function dirSize(root, options, prefix) {
  prefix = prefix || ''
  var size = 0
  options = options || {filter: noDotFiles, maxDepth: 0}

  var dir = p.join(root, prefix)

  try{
    var stat = fs.statSync(dir)
    if (stat.isDirectory()) {
      fs.readdirSync(dir)
      .filter(options.filter)
      .forEach(function (name) {
        size += dirSize(root, options, p.join(prefix, name))
      })
    } else {
      size += stat.size
    }
  } catch(e) {
    logger.error(e.code, e.message, e.stack) 
  }

  return size
}

// var fileTree 
module.exports = function(req, res, next) {
  fs.readdir(req.query.path, function(err, files) {
    if(err) {
      logger.error(err)
      return res.status(400).send({error: err}).end()
    }

    res.json(
      files
      //remove hidden
      .filter(function(v) { return !v || !/^\./.test(v) })
      .map(function(file) { 
        var absolute = p.join(req.query.path, file)

        try {
          var stat = fs.statSync(absolute)
          var f = {name: file, size: stat.size, path: absolute, prevDir: p.dirname(absolute), ext: p.extname(absolute)}

          if(stat.isDirectory() && !/\.app/i.test(file)) {
            f.prevDir = absolute
            f.prevDirRelative = file
            // f.type = 'folder'
          } else {

            if(/\.app/i.test(file)) {
              f.size = dirSize(absolute)
            }

            var m = mime.lookup(absolute)
            f.type = m.split('/')[0]

            if(!~['application', 'video', 'audio', 'image', 'text'].indexOf(f.type)) {
              f.type = 'application'
            }

          }

          return f
          
        } catch(e) {
          logger.error(e.code, e.message, e.stack) 
          return f || {}
        }
      })
    )
  })
}
