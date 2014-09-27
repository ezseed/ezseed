
describe('user', function(){

  it('should be unauthorized', function(cb) {
    request
      .get('/api/-')
      .end(function(error, res) {
        expect(res.status).to.equal(401)
        cb()
      })
  })

  it('should login', function(cb) {
    request
      .post('/api/login')
      .send(user)
      .set('Accept', 'application/json')
      .end(function(error, res) {
        expect(error).to.be.null
        expect(res.body).to.have.property('token')
        token = res.body.token
        cb()
      })
  })

  it('should been logged in', function(cb) {
    request
      .get('/api/-')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        expect(res.status).to.equal(200)
        expect(res.body.paths).to.have.length.of(1)
        cb()
      })
  })

  it('should be unauthorized because user is not admin', function(cb) {
    request
      .get('/admin/users')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        expect(res.status).to.equal(401)
        updateUser(cb)
      }) 
  })

  it('should login as admin', function(cb) {
    request
      .post('/api/login')
      .send(user)
      .set('Accept', 'application/json')
      .end(function(error, res) {
        expect(error).to.be.null
        expect(res.body).to.have.property('token')
        token = res.body.token
        cb()
      })
  })

  it('should be admin authorized', function(cb) {
    request
      .get('/admin/users')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        expect(res.status).to.equal(200)
        cb()
       })     
  })


  it('should get files', function(cb) {
    request
      .get('/api/-/files')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        expect(res.status).to.equal(200)
        expect(error).to.be.null
        cb()
      })
  })

  it('should get sizes', function(cb) {
    request
      .get('/api/-/size')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        expect(error).to.be.null
        expect(res.body).to.have.property('movies')
        expect(res.body).to.have.property('albums')
        expect(res.body).to.have.property('others')
        expect(res.body).to.have.property('total')
        cb()
      })
  })
})
