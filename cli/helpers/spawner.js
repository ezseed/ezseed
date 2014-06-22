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
