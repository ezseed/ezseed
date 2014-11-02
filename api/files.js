var files = require('express').Router()
  , logger = require('ezseed-logger')('files')
  , config = require('../lib/config')
  , db = require('ezseed-database').db
  , archiver = require('archiver')
  , p = require('path')
  , fs = require('fs')
  , debug = require('debug')('ezseed:api:files')

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

    if(req.params.type !== 'albums') {
      return res.status(501).send({error: "Can't archive files for type "+req.params.type}).end()
    }
    
    db[req.params.type].get(req.params.id, function(err, docs) {

      var filetype = db.helpers.filename(req.params.type)
        , archive = archiver('zip')

      docs = docs.toJSON()

      archive.on('error', function(err) {
        res.status(500).send({error: err.message})
      })

      res.attachment(docs.artist + ' - '+ docs.album + '.zip');

      res.on('close', function() {
        logger.log('Archive wrote %s bytes', archive.pointer())
        return res.sendStatus(200).end()
      })

      archive.pipe(res)

      //@todo if movies, try playing with .file
      archive.bulk([
        {expand: true, cwd: docs.prevDir, src: ['**'], dest: p.basename(docs.prevDir)}
      ])
      
      archive.finalize()

    })
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
