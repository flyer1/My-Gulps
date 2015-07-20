var replace = require('./gulp-odo-replace.js');

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('js', {
        name: 'Build app JS',
        description: 'Builds our app JS code into a single app.min.js file;  also creates a source map. (note:  not called if config.minify is not set)'
    });

    gulp.task('js', function (done) {

        if (!config.minify) {
            var chalk = require('chalk');
            console.log(chalk.red.bold('--> Skipping JS build task as config.minify is false <--'));
            done();
            return;
        }

        var replacements = getAllTextReplacements();
        var toDevice = config.target === 'DEVICE';
        var src = config.paths.src.js;

        gulp.src(src.all.concat(toDevice ? src.device : src.browser))
			.pipe(plugin.plumber())
			.pipe(plugin.angularFilesort())
			.pipe(replace(replacements))
			.pipe(plugin.sourcemaps.init({ loadMaps: true }))
			.pipe(plugin.concat('app.js'))
			.pipe(plugin.if(config.minify, plugin.uglify())) // only uglify if we are doing a BUILD
			.pipe(plugin.rename({ extname: '.min.js' }))
			.pipe(plugin.sourcemaps.write('../maps'))
			.pipe(gulp.dest(config.paths.dest.js))
			.on('end', done);
    });

    /* -- HELPERS -- */
    var replacements;

    function getAllTextReplacements() {
        if (!replacements) replacements = plugin.odoConfigHelper.getAllTextReplacements();
        return replacements;
    }

};