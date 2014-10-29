var db = require('ezseed-database').db
var spawn = require('child_process').spawn
var logger = require('ezseed-logger')('stream')
var fs = require('fs')
var debug = require('debug')('ezseed:stream')
var which = require('which')
var config = require('./config')

//sizes: https://www.ffmpeg.org/ffmpeg-utils.html
const FFMPEG = [
  '-preset', 'ultrafast',
  '-maxrate', '2500k',
  '-bufsize', '5000k',
  '-pix_fmt', 'yuv420p',
  '-strict', 'experimental',
]

const FFMPEG_IOS = [
  '-vcodec', 'libx264',
  '-s', 'vga', //640x480
  '-segment_list_type', 'm3u8',
  '-map', '0:v',
  '-map', '0:a:0',
  '-c:a', 'aac', //audio codec
  '-ar', '44100', //audio bitrate
  '-ac', '2', //stereo
  '-f', 'hls',
  '-pix_fmt', 'yuv420p',
  '-crf', '35',
  '-framerate', '12',
  '-g', '24',
  '-hls_time', '10', //hls time in sec
  '-hls_list_size', '6', //max list size
  '-hls_wrap', '18', //wrap after 18
  // '-hls_allow_cache', 'allowcache',
  '-start_number', '1',
]

const LIBAV_ANDROID = [
  '-c:a', 'libvo_aacenc',
  '-profile:a', 'aac_he_v2',
  '-c:v', 'h264',
  '-pre:v', 'medium',
  '-f', 'mp4',
  '-ac', '2',
  '-movflags',
  'frag_keyframe+empty_moov',
  '-map', '0:v',
  '-map', '0:a:0',

]

const FFMPEG_DESKTOP = [
  '-vcodec', 'libx264',
  '-acodec', 'aac',
  // '-framerate', '30',
  // '-g', '60',
  '-crf', '18',
  '-vb', '128k',
  '-ac', '2',
  '-ar', '44100',
  '-f', 'flv'
]

var command = config.converter

var spawner = function(res, arguments) {

  if(command === false) {
    //Not Implemented
    return res.status(501).end()
  }

  debug(command + ' ', arguments.join(' '))

  var ff = spawn(command, arguments, {cwd: config.tmp, stdio: ['ignore', 'pipe', 'pipe']})

  ff.stdout.pipe(res)

  ff.stderr.on('data', function(d) {
    debug(d.toString())
  })

  ff.stdout.on('close', function() {
    res.end()
  })

  res.on('close', function() {
    ff.kill()
    res.end()
  })

  res.on('eroor', function() {
    ff.kill()
    res.end()
  })

  ff.on('exit', function(code) {
    debug(command + ' closed with code', code)
    res.end()
  })
}

var stream = {
  ios: function(res, file) {
    res.type('m3u8')
    spawner(res, 
        ['-i', file.path]
        .concat(FFMPEG_IOS)
        .concat(FFMPEG)
        .concat(['pipe:1'])
    )
  },
  android: function(res, file) {
    res.type('mp4')
    spawner(res, 
      ['-i', file.path]
      .concat(LIBAV_ANDROID)
      .concat(FFMPEG)
      .concat(['pipe:1'])
    )
  },
  desktop: function(res, file) {
    res.type('flv')
    spawner(res, 
      ['-i', file.path]
      .concat(FFMPEG_DESKTOP)
      .concat(FFMPEG)
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
        return stream.ios(res, file)
        break;
      case 'androidos':
        return stream.android(res, file)
        break;
      //desktop
      default: 
        return stream.desktop(res, file)
        break;
    }

  })

}
