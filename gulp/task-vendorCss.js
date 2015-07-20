module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('vendorCss', {
        name: 'Build VENDOR CSS',
        description: 'Builds all vendor (ie: 3rd party) CSS code into a single vendor.min.css file;  also creates a source map for the CSS.'
    });

    var minOptions = { keepSpecialComments: 0 };

    gulp.task('vendorCss', function (done) {
        gulp.src(config.paths.src.vendorCss)
            .pipe(plugin.concat('vendor.css'))
            .pipe(plugin.sourcemaps.init({ loadMaps: true }))
            .pipe(plugin.if(config.minify, plugin.minifyCss(minOptions)))
            .pipe(plugin.rename({ extname: '.min.css' }))
            .pipe(plugin.sourcemaps.write('../maps'))
            .pipe(gulp.dest(config.paths.dest.css))
            .on('end', done);
    });
};