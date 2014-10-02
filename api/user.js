var api = require('express').Router()
  , config = require('../lib/config')
  , db = require('ezseed-database').db.user
  , p = require('path')
  , fs = require('fs')
  , jwt = require('express-jwt')
  , prettyBytes = require('pretty-bytes')
  , debug = require('debug')('ezseed:api')
  , logger = require('ezseed-logger')('api')

jwt.sign = require('jsonwebtoken').sign

api

.use(
  jwt({ secret: config.secret }).unless({ path: ['/api/login'] }) 
)

.use(function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    logger.error(err)
    return res.status(401).end()
  }

  next()
})

.post('/login', function(req, res) {

  db.login(req.body, function(err, user) {
    if(err) {
      return res.send({error: err}).status(401).end()
    } else {
      user.prettySize = prettyBytes(user.spaceLeft)
      user.token = jwt.sign(user, config.secret) 

      return res.json(user)
    }
  })

})

/** Protected methods **/

.get('/-', function(req, res) {

  //get user paths
  db.paths(req.user.id, function(err, user) {
    user.prettySize = prettyBytes(user.spaceLeft)
    return res.json(user)
  })

})


.get('/-/files', function(req, res) {
  var types = ['others', 'movies', 'albums']

  if(req.query.type && types.indexOf(req.query.type) === -1) 
    return res.status(500).send({error: req.params.type+' is not a valid type'}).end()

  if(req.query.match)
    req.query.match = JSON.parse(req.query.match)
  
  debug("Files", req.query)

  //need params, limit, dateUpdate, paths, type !
  db.files(req.user.id, req.query, function(err, paths) {

    if(req.query.type) {
      var files = {}
      files[req.query.type] = []
    } else {
      var files = {movies: [], albums: [], others: []} 
    }

    paths.paths.forEach(function(path) {
      for(var i in files) {
        for(var j in path[i]) {
          files[i].push(path[i][j])
        }
      }
    })

    return res.json(files)
  })
})

.get('/-/refresh', function(req, res) {
  db.paths(req.user.id, function(err, user) {
    process.watcher.client.call('refresh', user.paths, function(err, update) {
      if(err) {
        res.status(500).send({error: err})
      } else {
        res.json(update)
      }
    }) 
  })
})

// Mainly used for debugging
.get('/-/reset', function(req,res) {
  db.reset(req.user.id, function(err, paths) {
    if(err) {
      logger.error(err)
    }
    process.watcher.client.call('refresh', paths.paths, function(err, update) {
      if(err) {
        res.status(500).send({error: err})
      } else {
        res.json(update)
      }
    }) 
  })
})

.get('/-/size', function(req, res) {

  var size = {
    movies: 0,
    albums: 0,
    others: 0
  }, total = 0

  var opts = req.params.default ? {default: req.user.default_path} : {}

  db.files(req.user.id, opts, function(err, files) {

    if(!files) 
      return res.status(500).end()

    files.paths.forEach(function(p) {

      if(!req.params.path || req.params.paths.indexOf(p._id) !== -1 || req.params.paths.indexOf(p._id) !== -1) {
        for(var i in size) {
          p[i].forEach(function(files) {
            files[require('ezseed-database').helpers.filename(i)].forEach(function(file) {
              size[i] += file.size
            })
          })

          total += size[i]

        }
      }
    })

    size.total = total

    var pretty = {}

    //converting bytes to pretty version
    for(var i in size) {
      pretty[i] = {
        percent: size[i] / total * 100,
        bytes: size[i],
        pretty: prettyBytes(size[i])
      } 
    }

    return res.json(pretty)
  })
})

module.exports = api
