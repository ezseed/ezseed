describe('admin', function(){

  it('should exists (validPath)', function(cb) {
    request
      .get('/admin/validPath?path=test/fixtures/path')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        expect(res.status).to.equal(200)
        expect(res.body.error).to.be.false
        cb()
      })
  })

  it('should exists (validPath)', function(cb) {
    request
      .get('/admin/validPath?path=/something/that/does/not/exists')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        expect(res.status).to.equal(200)
        expect(res.body.error).to.be.true
        cb()
      })
  })
})
