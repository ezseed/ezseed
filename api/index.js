module.exports = function (app) {
  app
    .use('/admin', require('./admin'))
    .use('/api', require('./user'))
    .use('/', require('./files'))
}
