if(process.argv.indexOf('--quiet') !== -1 || process.argv.indexOf('-q') !== -1) {
  module.exports = require('./quiet_spawner')

} else {

  var Spawner = require('promise-spawner')
    , chalk = require('chalk')

  var spawner = new Spawner({
    out: chalk.blue('info') + ': ',
    err: chalk.red('error') + ': '
  })

  //add silent something here
  spawner.out.pipe(process.stdout)
  spawner.err.pipe(process.stderr)

  module.exports = spawner

}
