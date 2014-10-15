var files = require('express').Router()
  , logger = require('ezseed-logger')('files')
  , config = require('../lib/config')
  , db = require('ezseed-database').db
  , archiver = require('archiver')
  , p = require('path')
  , fs = require('fs')
  , ffmpeg


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

/** Protected methods **/
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
.get('/:type/:id/:action', function(req, res) {
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

      return res.download(docs.picture)
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

      //if movies, try playing with .file
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
  stream: function(req, res) {
    try {
      ffmpeg = require('fluent-ffmpeg')
      res.contentType('video/mp4')

      db.files.get(req.params.id, function(err, file) {
        // FLV stream - heavy cpu load
        // ffmpeg(file.path)
          // .flvmeta()
          // .format('flv')
          // .size('720x?')
          // .videoBitrate('1000k')
          // .videoCodec('libx264')
          // .fps(24)
          // .audioBitrate('96k')
          // .audioCodec('aac')
          // .audioFrequency(22050)
          // .audioChannels(2)
        
        // MP4 test - TODO stream phones
          // ffmpeg(file.path, {logger: logger})
          // .format('avi')
          // .videoCodec('libx264')
          // .audioCodec('aac')
          // .outputOptions(['-pix_fmt yuv420p','-movflags', '+faststart', '-preset ultrafast', '-qp 0'])
        
          // setup event handlers
          // .on('end', function() {
          //   logger.log('Stream - '+file.path+' has end')
          // })
          // .on('error', function(err) {
          //   logger.error(err.message)
          // })
          // save to stream
          // .writeToStream(res, {end:true})
      })

    } catch(e) {
      logger.error('File stream - ', err.message)
      res.send(500, {error: 'ffmpeg not installed'})
    }
  }
}

module.exports = files
