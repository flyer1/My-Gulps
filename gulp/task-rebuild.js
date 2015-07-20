
var runSequence = require('run-sequence');

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('rebuild', {
        name: 'Full Rebuild [no options]',
        description: 'Runs a CLEAN and then performs a full rebuild of our the "WWW" folder.',
        primary: true
    });


    gulp.task('rebuild', function(done) {
        runSequence('clean',
                           ['lint', 'js', 'vendor', 'templates', 'css', 'vendorCss', 'coreCopy', 'selectConfigXml'],
                           done);
    });

};