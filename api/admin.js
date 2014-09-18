var api = require('express').Router()
  , jwt = require('express-jwt')
  , db = require('ezseed-database').db
  , config = require('../lib/config')
  , fs = require('fs')
  , p = require('path')
  , logger = require('ezseed-logger')('admin')

jwt.sign = require('jsonwebtoken').sign

api

.use(jwt({ secret: config.secret }))
.use(function(err, req, res, next) {
  if(req.user.role == 'user' || err.name === 'UnauthorizedError') {
    res.status(401).end()
  }

  next()
})

.get('/users', function(req, res) {

  db.users.get(function(err, users) {
    if(err) {
      logger.error(err) 
      return res.status(500).send({error: err.message}).end()
    }

    res.send(users)
  })
})
.get('/paths', function(req, res) {

  db.paths.get(function(err, paths) {
    if(err) {
      logger.error(err) 
      return res.status(500).send({error: err.message}).end()
    }

    res.send(paths)
  })
})
.post('/path', function(req, res) {

  if(!req.body.path) {
    return res.status(500).send({error: 'No path to be updated'}).end()
  } else if(!fs.existsSync(p.resolve('/', req.body.path))) {
    return res.status(500).send({error: 'Path does not exist'}).end()
  }

  db.paths.save(req.body.path, function(err, p) {
    if(err) {
      logger.error(err)
      return res.status(500).send({error: err.message})
    } else {
      return res.send(p)
    } 
  })
})

.put('/path/:id_path', function(req, res) {

  if(!fs.existsSync(p.resolve('/', req.body.path))) {
    return res.status(500).send({error: 'Path does not exist'}).end()
  }

  db.paths.update(req.params.id_path, req.body, function(err) {
    if(err) {
      logger.error(err)
      return res.status(500).send({error: err.message})
    } else 
      return res.send({error: false})

  })
})
.delete('/path/:id_path', function(req, res) {

  if(!db.helpers.isObjectId(req.params.id_path)) {
    return res.status(500).send({error: 'id_path is not an ObjectId'}).end()
  } else {
    db.paths.remove(req.params.id_path, function(err) {
      if(err) {
        logger.error(err)
        return res.status(500).send({error: err.message})
      } else {
        return res.send({error: false})
      }
    })
  }

})

.put('/user/:id_user/path/:id_path', function(req, res) {
  db.user.update_path({_id: req.params.id_path}, {_id: req.params.id_user}, function(err) {
    if(err) {
      logger.error(err)
      return res.status(500).send({error: err.message})
    } else {
      return res.send({error: false})
    }
  })  
})

.delete('/user/:id_user/path/:id_path', function(req, res) {
  db.user.remove_path(req.params.id_path, req.params.id_user, function(err) {
    if(err) {
      logger.error(err)
      return res.status(500).send({error: err.message})
    } else {
      return res.send({error: false})
    }
  })
})

.put('/user/:id_user', function(req, res) {
  db.user.update(req.params.id_user, req.body, function(err) {
    if(err) {
      logger.error(err)
      return res.status(500).send({error: err.message})
    } else {
      return res.send({error: false})
    }
  })
})

.get('/validPath', function(req, res) {
  if(req.query.path && fs.existsSync(req.query.path)) {
    res.send({error: false})
  } else {
    res.send({error: true})
  }
})
module.exports = api
