var files = require('express').Router()
  , logger = require('ezseed-logger')('files')
  , db = require('ezseed-database').db
  , ffmpeg


files

.param('type', function(req, res, next) {
  var types = ['others', 'movies', 'albums', 'files']

  if(types.indexOf(req.params.type) > -1)
    next()
  else
    res.send(500, {error: req.params.type+' is not a valid type'})
})

.param('id', function(req, res, next) {
  if(db.helpers.isObjectId(req.params.id)) {
    next()
  } else {
    res.send(500, {error: req.params.type+' is not a valid type'})
  }

})

/** Protected methods **/
.get('/:type/:id', function(req, res) {
  if(req.params.type !== 'files')
    db[req.params.type].get(req.params.id, function(err, res) {
      if(err)
        throw err

      res.json(res)
    })
  else
    res.send(500, {error: 'Files is not a valid type'})
})
.get('/:type/:id/:action', function(req, res) {
  return action[req.params.action](req, res)
})

var action = {
  delete: function(params) {
    //@todo rpc
  },
  download: function(req, res) {
    db.files.get(req.params.id, function(err, file) {
      if(err) {
        logger.error('File download - ', err.message)
        res.send(404, {error: 'File not found'})
      } else {
        console.log(file)
      }
    })
  },
  stream: function(req, res) {
    try {
      ffmpeg = require('fluent-ffmpeg')
      res.contentType('flv')

      db.files.get(req.params.id, function(err, file) {
        new ffmpeg({ source: file.path, nolog: true })

          // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
          .usingPreset('flashvideo')
          // setup event handlers
          .on('end', function() {
            logger.log('Stream - '+file.path+' has end')
          })
          .on('error', function(err) {
            logger.error(err.message)
          })
          // save to stream
          .writeToStream(res, {end:true})
      })

    } catch(e) {
      logger.error('File stream - ', err.message)
      res.send(500, {error: 'ffmpeg not installed'})
    }
  }
}

module.exports = files
