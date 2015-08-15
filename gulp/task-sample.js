var chalk = require('chalk');

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('sample', {
        name: 'sample',
        description: 'sample task description',
    });

    gulp.task('sample', function (done) {

        try {
            // do stuff
        } catch (e) {

            console.log(chalk.red('Error has occurred', e));
        }

    });


};