var Promise = require('bluebird')
  , logger = require('ezseed-logger')
  , i18n = require('i18n')
  , debug = require('debug')('ezseed:cli')

module.exports = {
	checkroot: function() {
		if(process.getuid() !== 0) {
			logger.error('Sorry but this needs to be run as root. Exiting.')
				process.exit(1)
		}

		return true
	},
	next: function() {
		var args = [].slice.call(arguments)
		return new Promise(function(resolve, reject) { return resolve.apply(null, args) })
	},
	condition: function(condition, success, failed) {

		if(condition)
			return success()
		else
			return typeof failed == 'function' ? failed() : this.next()

	},
	exit: function(message) {
		return function(code) {
			if(code === 0)
				logger('exit').info(message, i18n.__('was successful'))
			else {
        if(code instanceof Error) {
  				logger('exit').error(message, i18n.__('failed with error:'))
          logger().error(code.stack)
        } else {
          logger('exit').error(message, i18n.__('failed with code: %s', code))
			  }
      }

			process.exit(code)
		}
	}
}
