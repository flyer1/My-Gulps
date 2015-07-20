module.exports = function () {
	
	var config = require('../config/gulp-config.json');

	var service = {
		 getConfig: getConfig,
	};
	
	return service;

	////////////////////////////////// IMPLEMENTATION /////////////////////////////////

	function getConfig() {		
		return config;
	}
}