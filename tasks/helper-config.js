module.exports = function () {
	
	var config = require('../config/gulp-config.json');
	config.paths = require('../config/gulp-paths.json');

	var service = {
		 getConfig: getConfig,
		 getAllTextReplacements:getAllTextReplacements
	};
	
	return service;

	function getConfig() {		
		return config;
	}
	// Reads the text replacement configuration data, and then using the gulp-config settings, consolidates all the various text replacements into a single flattened configuration
	function getAllTextReplacements() {
		var i;
		var replacementConfig = require('../config/text-replacements.json');

		var replacements = replacementConfig.env[config.env].files,
			platformFiles = replacementConfig.platform[config.platform].files,
			targetFiles = replacementConfig.target[config.target].files;

		for (i = 0; i < platformFiles.length; i++) {
			addToReplacements(replacements, platformFiles[i]);
		}

		for (i = 0; i < targetFiles.length; i++) {
			addToReplacements(replacements, targetFiles[i]);
		}

		return replacements;

		function addToReplacements(files, file) {
			var existing = find(files, file.fileName);
			if (existing) {
				Array.prototype.push.apply(existing.replacements, file.replacements);
			} else {
				replacements.push(file);
			}
		}

		function find(files, fileToFind) {
			for (var i = 0; i < files.length; i++) {
				if (files[i].fileName === fileToFind) return files[i];
			}
			return null;
		}
	}
}