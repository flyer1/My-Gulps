module.exports = function (gulp, config, plugin, help) {


    help.registerHelp('templates', {
        name: 'Build Angular Template Cache',
        description: 'Builds all our app HTML files into a templates.min.js file;  this file contains code to load the HTML into Angular\'s template cache.'
    });

	var minOptions = { empty: true, spare: true, quotes: true };

	gulp.task('templates', function () {
	    return gulp.src(config.paths.src.templates)
	        .pipe(plugin.minifyHtml(minOptions))
	        .pipe(plugin.ngHtml2js({ moduleName: 'templates' }))
	        .pipe(plugin.concat('templates.js'))
	        .pipe(plugin.rename({ extname: '.min.js' }))
	        .pipe(plugin.if(config.minify, plugin.uglify()))
	        .pipe(gulp.dest(config.paths.dest.js));
	});
};