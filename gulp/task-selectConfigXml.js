var fs = require('fs');

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('selectConfigXml', {
        name: 'Select config.xml file',
        description: 'Copies an appropriate config.xml file from the CONFIG folder based on the current build config\'s platform setting.'
    });

	gulp.task('selectConfigXml', function (done) {

		var fileName = './config/config.' + config.platform.toLowerCase() + '.xml';
		fs.createReadStream(fileName).pipe(fs.createWriteStream('./config.xml'));
		done();
	});	
	
};