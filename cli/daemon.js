module.exports = function(client) {
  return function(opts) {
    require('./commands/daemon').client(client)(opts)
    .then(helper.exit(i18n.__('Daemon %s %s', opts.command, client)))
    .catch(helper.exit(i18n.__('Daemon %s %s', opts.command, client)))
  }
}
