var app = require('express')()

app.use(require('body-parser').json())

require('./api')(app)

app.listen(require('./lib/config').port || 3000)

module.exports = app
