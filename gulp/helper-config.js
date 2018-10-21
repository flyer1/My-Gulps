module.exports = function () {

	var config = require('./gulp-config.json');

	var service = {
		 getConfig: getConfig,
	};

	return service;

	////////////////////////////////// IMPLEMENTATION //////////////////////////////////

	function getConfig() {
		return config;
	}
}
