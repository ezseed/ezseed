var inquirer = require('inquirer')
  , Promise = require('bluebird')

module.exports = function() {
  return new Promise(function(resolve, reject) {

    inquirer.prompt(
    {
      type	  : "list",
      name      : "lang",
      message   : "Lang?",
      default   : "en",
      choices   : ["fr","en"]
    }, function(answer) {
      resolve(answer.lang)
    })
  })
}
