var replace = require('./gulp-odo-replace.js');

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('coreCopy', {
        name: 'Plain old XCOPY, gulp-ified',
        description: 'Copies our fonts & images to the WWW folder;  also copies the index.html file... And if !config.minify, then also our app JS files'
    });

    gulp.task('coreCopy', ['fonts', 'images', 'indexHtml', 'jsCopy', 'augReality']);

    gulp.task('augReality', function () {
        return gulp.src('src/aug-reality/**')
                   .pipe(plugin.newer('www/aug-reality/'))
                   .pipe(gulp.dest('www/aug-reality/'));

    });

    gulp.task('fonts', function () {
        return gulp.src(config.paths.src.fonts)
                   .pipe(plugin.newer(config.paths.dest.fonts))
                   .pipe(gulp.dest(config.paths.dest.fonts));
                   
    });

    gulp.task('images', function () {
        return gulp.src(config.paths.src.images)
                    .pipe(plugin.newer(config.paths.dest.images))
                    .pipe(gulp.dest(config.paths.dest.images));
    });

    gulp.task('indexHtml', function () {

        var replacements = getAllTextReplacements();

        if (!config.minify) {
            return gulp.src(config.paths.src.indexHtml)
              .pipe(plugin.inject(gulp.src(getAllJsPaths())
                                      .pipe(plugin.angularFilesort()), // unfortunately we need to read in all file contents such that we can sort the script tags appropriately
                                 { name: 'appJs', relative: true }))
              .pipe(replace(replacements))
              .pipe(plugin.newer(config.paths.dest.root))
              .pipe(gulp.dest(config.paths.dest.root));
        } else {
            return gulp.src(config.paths.src.indexHtml)
                        .pipe(replace(replacements))
                        .pipe(plugin.newer(config.paths.dest.root))
                        .pipe(gulp.dest(config.paths.dest.root));
        }
    });

    gulp.task('jsCopy', function (done) {
         
        // only copy our app JS files around if we're not minify-ing
        if (!config.minify) {
            var replacements = getAllTextReplacements();
            gulp.src(getAllJsPaths())
                .pipe(plugin.newer(config.paths.dest.root))
                .pipe(replace(replacements))
                .pipe(gulp.dest(config.paths.dest.root));
        }

        done();
    });

    /* -- HELPERS -- */
    var replacements;
    
    function getAllTextReplacements() {
        if (!replacements) replacements = plugin.odoConfigHelper.getAllTextReplacements();
        return replacements;
    }

    function getAllJsPaths() {
        var toDevice = config.target === 'DEVICE';
        var src = config.paths.src.js;
        return src.all.concat(toDevice ? src.device : src.browser);
    }
}