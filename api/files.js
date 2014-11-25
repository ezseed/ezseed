var files = require('express').Router()
var logger = require('ezseed-logger')('files')
var config = require('../lib/config')
var db = require('ezseed-database').db
var p = require('path')
var fs = require('fs')
var archiver = require('../lib/archiver')
var debug = require('debug')('ezseed:api:files')

var previous_filesize = 0

files

.param('type', function(req, res, next) {
  var types = ['others', 'movies', 'albums', 'files']

  if(types.indexOf(req.params.type) > -1)
    next()
  else
    res.status(500).send({error: req.params.type+' is not a valid type'})
})

.param('id', function(req, res, next) {
  if(db.helpers.isObjectId(req.params.id)) {
    next()
  } else {
    res.status(500).send({error: req.params.id+' is not a valid id'})
  }

})

.get('/files/archive', function(req, res, next) {

  var bulk = []

  for(var i in req.query.paths) {
    var e = req.query.paths[i]
    
    if(e.prevDir == e.path) {
      bulk.push({
        expand: true, cwd: e.prevDir, src: ['**'], dest: p.basename(e.prevDir)
      }) 
    } else {
      bulk.push({
        expand: true, cwd: e.prevDir, src: [e.name], dest: '' 
      }) 
    }
  }

  return archiver(req,res, {
    name: req.query.name,
    bulk: bulk
  })

})

.get('/download', function(req, res, next) {
  fs.exists(req.query.path, function(exists) {
    if(!exists) {
      return res.status(404).end()
    }

    fs.stat(req.query.path, function(err, stats) {
      if(stats.isDirectory()) {
        return res.status(418).end()
      }

      if(!req.query.read) {
        return res.download(req.query.path)
      } else {
        return res.sendFile(req.query.path)
      }
    })
 
  })
})

.get('/:type/:id', function(req, res) {

  db[req.params.type].get(req.params.id, function(err, docs) {
    if(err)
      throw err

    if(!docs) {
      res.status(404).send({error: 'File not found'})
    } else {
      res.send(docs)
    }
  })

})
.get('/:type/:id/:action/:os?', function(req, res) {
  return action[req.params.action](req, res)
})

var action = {
  delete: function(params) {
    //@todo rpc
  },
  cover: function(req, res) {
    if(req.params.type !== 'albums') {
      return res.status(501).send({error: "Can't get cover for type "+req.params.type}).end()
    }

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    db[req.params.type].get(req.params.id, function(err, docs) {
      docs = docs.toJSON()

      if(fs.existsSync(docs.picture)) {
        return res.download(docs.picture)
      } else {
        return res.status(404).end()
      }
    })
  },
  archive: function(req, res) {

    if(req.params.type === 'albums') {
    
      db[req.params.type].get(req.params.id, function(err, docs) {

        var filetype = db.helpers.filename(req.params.type)

        docs = docs.toJSON()

        //@todo if movies, try playing with .file
        return archiver(req,res, {
          name: docs.artist + ' - '+ docs.album,
          bulk: [
            {expand: true, cwd: docs.prevDir, src: ['**'], dest: p.basename(docs.prevDir)}
          ]
        })


      })
    } else if(req.param.type == 'explorer'){
       
    } else {
      return res.status(501).send({error: "Can't archive files for type "+req.params.type}).end()
    }
  },
  download: function(req, res) {
    db.files.get(req.params.id, function(err, file) {
      if(err) {
        logger.error('File download - ', err.message)
        res.send(404, {error: 'File not found'})
      } else {
        
        res.download(file.path)
      }
    })
  },
  stream: require('../lib/stream.js')
}

module.exports = files
