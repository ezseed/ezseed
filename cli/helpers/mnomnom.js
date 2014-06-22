var mnomnom = {
  /**
  * Commands
  * hack to pass multiple command to a callback
  * @param  {String}   value    commands
  * @param  {Function} callback [description]
  * @return program instance
  */
  commands: function(value) {

    value = value.split(' ')

    var l = value.length, i = 0

    //to store the commands objects
    this.chain._list = {}

    //bind to command object
    for(i = 0; i < l; i++) {
      this.chain._list[value[i]] = this.command(value[i])
    }

    return this.chain
  },
  chain: {}
}

/**
 * duplicate command methods
 * @param  {string} k [key from original command]
 * @return {this}   
 */
var duplicate = function(k) {
  return function(item) {
    var keys = Object.keys(this._list), l = keys.length

    var func

    if('function' == typeof item) {
      func = item
    } else {
      func = function() { return item }
    }

    while(l--) {
      this._list[keys[l]][k](func(keys[l]))
    }

    return this
  }
}

/**
 * I've found no way atm to clone program.command() object without refering a command
 * so we need one to be overriden later
 */
module.exports = function (program, cmd) {

  cmd = program.command(cmd || 'help')
  var key

  for(key in cmd) {
    //define props on the chain
    Object.defineProperty(mnomnom.chain, key, {
      value: duplicate(key),
      enumerable: true
    })
  }

  var k = Object.keys(mnomnom), l = k.length

  //extending
  while(l--) {
    program[k[l]] = mnomnom[k[l]]
  }

  return program
}