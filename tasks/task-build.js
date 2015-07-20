
var runSequence = require('run-sequence');

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('build', {
        name: 'Incremental Build [no options]',
        description: 'Performs a build of our app JS files, our app CSS, and our HTML, and also runs jsHint against our JS.',
        primary: true
    });

    gulp.task('build', function (done) {

        if (config.minify) {
            runSequence(['lint', 'js', 'css', 'templates'], done);
        } else {
            runSequence(['lint', 'jsCopy', 'css', 'templates'], done);
        }
    });
};