var api = require('express').Router()
  , config = require('../lib/config')
  , db = require('ezseed-database').db.user
  , jwt = require('express-jwt')
  , logger = require('ezseed-logger')('api')

jwt.sign = require('jsonwebtoken').sign

api

//database => ajouter path taille - hmm calcul de fichier = possible
//db, ajouter -hash partout \o/
//watcher => mettre a jour taille chemin

.use(jwt({ secret: config.secret, skip: ['/login'] }))

.post('/login', function(req, res) {

  db.login(req.body, function(err, user) {
    if(err) {
      return res.send(401)
    } else {
      var token = jwt.sign(user, config.secret)
      return res.json({token: token})
    }
  })

})

/** Protected methods **/

.get('/-', function(req, res) {

  //get user paths
  db.paths(req.user.id, function(err, user) {
    return res.json(user)
  })

})


.get('/-/files', function(req, res) {
  //need params, limit, dateUpdate, paths, type !
  db.files(req.user.id, {}, function(err, files) {
    return res.json(files)
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

    files.paths.forEach(function(p) {

      if(!req.params.path || req.params.paths.indexOf(p._id) !== -1 || req.params.paths.indexOf(p._id) !== -1) {

        for(var i in size) {
          p[i].forEach(function(file) {
            size[i] += file.size
          })

          total += size[i]

        }
      }

    })

    size.total = total

    return res.json(size)
  })
})

module.exports = api
