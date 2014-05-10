var menu_width = 63
var menu = require('terminal-menu')({ width: menu_width, bg: 'blue', fg: 'white'}), 
	chalk = require('chalk'), 
	rainbow = require('ansi-rainbow')

var line = function() {
	var str = '', i = 0
	for(i = 0; i < menu_width - 1; i++) {
		str += '-'
	}

	return str + '\n'
}

var center = function(string) {
	var l = string.length - menu_width, offset = menu_width - l

	if(offset <= 0)
		return string
	else {
		var left = Math.ceil(offset/2), right = Math.floor(offset/2)
		
		return new Array(left).join(' ') + string + [right].join(' ')
	}
}

rainbow.options({space_color: 'bgBlue', color_space: true}).add('bgBlack').skip('bgBlue')

menu.reset()
menu.write(center(chalk.bold.bgBlack(rainbow.bg("                                                         _|\n"))))
menu.write(center(chalk.bold.bgBlack(rainbow.bg("   _|_|    _|_|_|_|    _|_|_|    _|_|      _|_|      _|_|_|\n"))))
menu.write(center(chalk.bold.bgBlack(rainbow.bg(" _|_|_|_|      _|    _|_|      _|_|_|_|  _|_|_|_|  _|    _|\n"))))
menu.write(center(chalk.bold.bgBlack(rainbow.bg(" _|          _|          _|_|  _|        _|        _|    _|\n"))))
menu.write(center(chalk.bold.bgBlack(rainbow.bg("   _|_|_|  _|_|_|_|  _|_|_|      _|_|_|    _|_|_|    _|_|_|\n"))))

menu.write('\n');
menu.write(line());

menu.add('install')
menu.add('ezseed - start, stop, restart')
menu.add('rtorrent - start, stop, restart')
menu.add('transmission - start, stop, restart')
menu.add('backup')
menu.add('update')
menu.add('credits')
menu.add('exit')

menu.on('select', function (label) {

	if(label == 'exit')
	    menu.close()

    console.log('SELECTED: ' + label)
})

module.exports = function (command) {
	menu.createStream().pipe(process.stdout)
}