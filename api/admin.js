var api = require('express').Router()
  , jwt = require('express-jwt')
  , db = require('ezseed-database').db
  , config = require('../lib/config')
  , fs = require('fs')
  , p = require('path')
  , logger = require('ezseed-logger')('admin')

api
//set jsonwebtoken secret
.use(jwt({ secret: config.secret }))
//middlewares for unauthorized errors or role that does not match
.use(function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    return res.status(401).end()
  }

  next()
})
.use(function(req, res, next) {
  if(req.user.role == 'user') {
    return res.status(401).end()
  }

  next()
})
/**
 * @param GET /users
 * @return {array} users
 */
.get('/users', function(req, res) {

  db.users.get(function(err, users) {
    if(err) {
      logger.error(err) 
      return res.status(500).send({error: err.message}).end()
    }

    res.send(users)
  })
})

/**
 * @param GET /paths
 * @return {array} paths
 */
.get('/paths', function(req, res) {

  db.paths.get(function(err, paths) {
    if(err) {
      logger.error(err) 
      return res.status(500).send({error: err.message}).end()
    }

    res.send(paths)
  })
})

/**
 * Creates a path
 * @param POST /path
 * @param {string} path
 * @return {Object} new path
 */
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

/**
 * Updates a path
 * @param PUT /path/:id_path
 * @return {Object} error
 */
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

/**
 * Delete path
 * @param DELETE /path/:id_path
 * @return {Object} error
 */
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

/**
 * Adds a path to the user (he is watching it)
 * @param PUT /user/:id_user/path/:id_path
 * @return {Object} error
 */
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

/**
 * Delete user path
 * @param DELETE /user/:id_user/path/:id_path
 * @return {Object} error
 */
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

/**
 * Update user
 * @param PUT /user/:id_user
 * @param {Object} body key/values
 * @return {Object} error
 */
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

/**
 * Valid if a path exists
 * @param GET /validPath
 * @param {string} path path to be testsed
 * @return {Object} error true or false
 * @todo should return bool - must have been tired
 */
.get('/validPath', function(req, res) {
  if(req.query.path && fs.existsSync(req.query.path)) {
    res.send({error: false})
  } else {
    res.send({error: true})
  }
})

module.exports = api
