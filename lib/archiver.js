var archiver = require('archiver')
var logger = require('ezseed-logger')('files')

var archive = function Archive(req, res, archive) {

  var type = 'zip' //could be changed
  var zip = archiver(type, {statConcurrency: require('os').cpus().length, store: true, zlib: {level: 0, chunkSize: 32*1024}})

  zip.on('error', function(err) {
    logger.error(err)
    res.status(400).send({error: err.message})
  })

  res.attachment(archive.name + '.' + type)

  res.on('close', function() {
    logger.log('Archive wrote %s bytes', zip.pointer())
    return res.status(200).end()
  })

  zip.pipe(res)

  zip.bulk(archive.bulk)
  
  zip.finalize()

}

module.exports = archive
