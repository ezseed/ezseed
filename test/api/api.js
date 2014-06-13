var db = require('ezseed-database').db

var user = {
			username: 'test-user' + Math.round(Math.random() * 100),
			password: 'crazy-password',
			role: 'admin'
		}
		, user_path = '/home/'+user.username+'/downloads'
	  , token

describe('user', function(){

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

  it('should login', function(cb) {
    request
      .post('/api/login')
			.send(user)
      .set('Accept', 'application/json')
      .end(function(error, res){
        expect(error).to.be.null
				expect(res.body).to.have.property('token')
				token = res.body.token
        cb()
      });
  })

	it('should been logged in', function(cb) {
		request
			.get('/api/-')
			.set({'Authorization': 'Bearer '+token})
			.end(function(error, res) {
				expect(res.body.paths).to.have.length.of(1)
				cb()
			})
	})

	it('should get files', function(cb) {
		request
			.get('/api/-/files')
			.set({'Authorization': 'Bearer '+token})
			.end(function(error, res) {
				console.log(res.text)
				cb()
			})
	})
})
