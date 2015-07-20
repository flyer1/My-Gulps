var del = require('del');           // File & Directory deletion helper

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('clean', {
        name: 'Delete the WWW',
        description: 'Calls in Samuel L. Jackson, aka "The Cleaner", who takes out the WWW directory....permanently!',
        primary:true
    });

    gulp.task('clean', function (done) {
        del(config.paths.dest.root, done);
    });
};