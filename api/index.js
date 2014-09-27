
module.exports = function (app) {
  app.use('/admin', require('./admin'))
  app.use('/api', require('./user'))
  app.use('/', require('./files'))
}
