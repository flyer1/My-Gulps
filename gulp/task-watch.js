module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('watch', {
        name: 'Watch',
        description: 'Sets up watchers on our app JS, HTML, CSS, and "core content";  kicks off appropriate tasks when they change.'
    });

    gulp.task('watch', function () {
        console.log('Starting watchers;  IMPORTANT:  VENDOR FILES ARE NOT WATCHED!');

        var src = config.paths.src;

        // note - i'm not watching the device / browser specific JS files here...
        if (config.minify) {
            gulp.watch(src.js.all, ['js', 'lint']);
        } else {
            gulp.watch(src.js.all, ['jsCopy', 'indexHtml', 'lint']);
        }

        gulp.watch(src.css, ['css']);

        gulp.watch(src.templates, ['templates']);

        gulp.watch(src.indexHtml, ['indexHtml']);
        gulp.watch(src.images, ['images']);
        gulp.watch(src.fonts, ['fonts']);
    });
}