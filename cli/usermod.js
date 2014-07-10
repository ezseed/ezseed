var db = require('ezseed-database')
  , helper = require('./helpers/promise')

module.exports = function(opts) {
  var u = {}

  u[opts.key] = opts.value

  db.user.update(opts.username, u, function(err, user) {
    if(err) {
      throw err
    } else {

      if(opts.key == 'password') {
        //?
/**
 * rtorrent:
 * var cmd = 'python '+global.app_path+'scripts/rutorrent/htpasswd.py -b /usr/local/nginx/rutorrent_passwd '+username+' '+password;
 *
 * exec(cmd, function (err, stdout, stderr) {
 *     return require(global.app_path + '/bin/lib/user').password(username, password, done);
 * });
 *
 * //transmission + conf path / user ~/?
 *var settings = global.app_path + '/scripts/transmission/config/settings.'+username+'.json';
 *
 *   var d = jf.readFileSync(settings);
 *
 *   d['rpc-password'] = password;
 *
 *   jf.writeFileSync(settings, d);
 *
 *   //restarting daemon
 *   daemon('transmission', 'start', username, done);
 *
 */
      } else {
        helper.exit('Usermod')(0)
      }
    }

  })
}
