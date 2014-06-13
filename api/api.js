var api = require('express').Router()
  , config = require('../lib/config')
  , db = require('ezseed-database').db.user
  , jwt = require('express-jwt')

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
  //need params, limit, dateUpdate !
  db.files(req.user.id, 0, 0, function(err, files) {
    return res.json(files)
  })
})

.get('/-/size', function(req, res) {

  db.files(req.user.id, function(err, files) {
    //etc.
  })
})

module.exports = api
