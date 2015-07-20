module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('lint', {
        name: 'Linting via jsHint',
        description: 'Runs the jsHint linter against the entire app JS code base.'
    });

    gulp.task('lint', function (done) {

        console.log('Running linter');

        gulp.src(config.paths.src.js.all)
            .pipe(plugin.plumber())
            .pipe(plugin.cached('app'))
            .pipe(plugin.jshint())
            .pipe(plugin.jshint.reporter('jshint-stylish'));

        // Important - call done() directly;  do not use ".on('end', done);"
        done();
    });
};