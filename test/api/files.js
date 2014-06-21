
describe('files', function(){

  it('should get movies', function(cb) {
    request
      .get('/movies/id/download')
      .set({'Authorization': 'Bearer '+token})
      .end(function(error, res) {
        console.log(res.text)
      })
  })

})
