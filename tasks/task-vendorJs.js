module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('vendor', {
        name: 'Build VENDOR JS',
        description: 'Builds all vendor (ie: 3rd party) JS code into a single vendor.min.js file;  also creates a source map.'
    });

    gulp.task('vendor', function () {
        
        var toDevice = config.target === 'DEVICE';
        var src = config.paths.src.vendorJs;
        
        return gulp.src(src.all.concat(toDevice ? src.device :  src.browser))
                    .pipe(plugin.plumber())
                    .pipe(plugin.sourcemaps.init({ loadMaps: true }))
                    .pipe(plugin.concat('vendor.js'))
                    .pipe(plugin.if(config.minify, plugin.uglify()))
                    .pipe(plugin.rename({ extname: '.min.js' }))
                    .pipe(plugin.sourcemaps.write('../maps'))
                    .pipe(gulp.dest(config.paths.dest.js));
            
    });
}