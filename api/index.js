
module.exports = function (app) {
  app.use('/admin', require('./admin'))
  app.use('/user', require('./user'))
  app.use('/', require('./files'))
}
