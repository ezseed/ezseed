request = require('supertest')(require('../server.js'))
expect = require('chai').expect

describe('ezseed', function() {
  before(function(cb) {
    require('ezseed-database')({database: 'ezseed-test'}, cb)
  })

  require('./api/api')
})
