
module.exports = function (app) {
  app.use('/api', require('./api'))
  app.use('/', require('./files'))
  app.use('/admin', require('./admin'))
}
