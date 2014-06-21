var db = require('ezseed-database').db

request = require('supertest')(require('../server.js'))
expect = require('chai').expect

user = {
  username: 'test-user' + Math.round(Math.random() * 100),
  password: 'crazy-password',
  role: 'admin'
}

user_path = '/home/'+user.username+'/downloads'

token = ''

describe('ezseed', function() {
  before(function(cb) {
    require('ezseed-database')({database: 'ezseed-test'}, cb)
  })


  before(function(cb) {
		db.user.create(user, function(err, u) {
			db.paths.save(
				user_path,
				{
					_id: u._id,
					default: true
				},
				cb)
		})
  })

  require('./api/api')
  require('./api/files')
})
