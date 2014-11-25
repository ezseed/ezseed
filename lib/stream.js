var db = require('ezseed-database').db
var spawn = require('child_process').spawn
var logger = require('ezseed-logger')('stream')
var fs = require('fs')
var debug = require('debug')('ezseed:stream')
var which = require('which')
var config = require('./config')

//sizes: https://www.ffmpeg.org/ffmpeg-utils.html

const LIBAV_IOS = [
  '-c:v', 'h264',
  '-c:a', 'libvo_aacenc',
  '-profile:a', 'aac_he_v2',
  '-f', 'hls',
  '-ar', '44100',
  '-ac', '2',
  '-hls_time', '10',
  '-hls_list_size', '6',
  '-hls_wrap', '18',
  // '-hls_allow_cache', 'allowcache',
  '-start_number', '1'
]

//https://libav.org/avconv.html
const LIBAV_ANDROID = [
  '-c:a', 'libvorbis',
  '-c:v', 'libvpx',
  '-ar', '44100',
  '-f', 'webm',
  '-ac', '2',
]

const LIBAV_DESKTOP = [
  '-c:a', 'libvo_aacenc',
  '-profile:a', 'aac_he_v2',
  '-c:v', 'h264',
  '-f', 'flv',
  '-ac', '2'
]

var command = config.converter

var spawner = function(req, res, arguments) {

  if(command === false) {
    //Not Implemented
    return res.status(501).end()
  }

  req.connection.setTimeout(0)

  debug(command + ' ', arguments.join(' '))

  var ff = spawn(command, arguments, {cwd: config.tmp, stdio: ['ignore', 'pipe', 'pipe']})

  ff.stdout.pipe(res)

  ff.stderr.on('data', function(d) {
    debug(d.toString())
  })

  ff.stdout.on('close', function() {
    res.end()
  })

  ff.stderr.on('close', function(d) {
    res.end()
  })

  res.on('close', function() {
    ff.kill()
    res.end()
  })

  res.on('error', function() {
    ff.kill()
    res.end()
  })

  ff.on('exit', function(code) {
    debug(command + ' closed with code', code)
    res.end()
  })
}

var stream = {
  ios: function(req, res, file) {
    res.type('m3u8')
    spawner(req, res, 
        ['-re', '-i', file.path]
        .concat(LIBAV_IOS)
        .concat(['pipe:1'])
    )
  },
  android: function(req, res, file) {
    res.type('webm')
    spawner(req, res, 
      ['-re', '-i', file.path]
      .concat(LIBAV_ANDROID)
      .concat(['pipe:1'])
    )
  },
  desktop: function(req, res, file) {
    res.type('flv')
    spawner(req, res, 
      ['-re', '-i', file.path]
      .concat(LIBAV_DESKTOP)
      .concat(['pipe:1'])
    )
  }
}

module.exports = function(req, res) {

  db.files.get(req.params.id, function(err, file) {
    if(err) {
      logger.error('File download - ', err.message)
      return res.status(500).send({error: err.message}).end()
    }

    if(!file || !fs.existsSync(file.path)) {
      return res.status(404).send({error: 'File not found'}).end()
    }

    debug('streaming file', req.params.os)
    
    if(req.params.os) {
      req.params.os = req.params.os.toLowerCase()
    }

    //http://hgoebl.github.io/mobile-detect.js/doc/MobileDetect.html#os
    switch(req.params.os) {
      case 'ios': 
      case 'safari':
        return stream.ios(req, res, file)
        break;
      case 'androidos':
        return stream.android(req, res, file)
        break;
      //desktop
      default: 
        return stream.desktop(req, res, file)
        break;
    }

  })

}
