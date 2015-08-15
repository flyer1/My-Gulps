var gulp = require('gulp');
var plugin = require('gulp-load-plugins')({ lazy: true });
var help = require('./gulp/task-help.js')(gulp);
var config =  require('./gulp/helper-config.js')().getConfig();

// Load up all of your custom gulp tasks here, each contained within their own file
require('./gulp/task-photos.js')(gulp, config, plugin, help);
require('./gulp/task-sample.js')(gulp, config, plugin, help);


// Default task is showing help
gulp.task('default', ['help']);
