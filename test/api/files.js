
describe('files', function(){

  it('should fail getting bad type', function(cb) {
    request
      .get('/something/id')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        expect(res.status).to.equal(500)
        expect(res.body.error).to.contain('not a valid type')
        cb()
      })
  })

  it('should fail id not valid', function(cb) {
    request
      .get('/movies/nonexistant')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        expect(res.status).to.equal(500)
        expect(res.body.error).to.contain('not a valid id')
        cb()
      })
  })

})
