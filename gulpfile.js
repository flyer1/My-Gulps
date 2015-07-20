var gulp = require('gulp');
var plugin = require('gulp-load-plugins')({ lazy: true });
var help = require('./tasks/task-help.js')(gulp);
var config =  require('./tasks/helper-config.js')().getConfig();

// Load up all of the custom tasks
require('./tasks/task-photos.js')(gulp, config, plugin, help);

// Default task is showing help
gulp.task('default', ['help']);

/*
// get our config for use in all our tasks
// hard wire our configuration helper right onto the plugin so we can pass it around
// All our custom tasks
require('./gulp/task-config.js')(gulp, config, plugin, help);
require('./gulp/task-clean.js')(gulp, config, plugin, help);
require('./gulp/task-lint.js')(gulp, config, plugin, help);
require('./gulp/task-js.js')(gulp, config, plugin, help);
require('./gulp/task-vendorJs.js')(gulp, config, plugin, help);
require('./gulp/task-templates.js')(gulp, config, plugin, help);
require('./gulp/task-coreCopy.js')(gulp, config, plugin, help);
require('./gulp/task-css.js')(gulp, config, plugin, help);
require('./gulp/task-vendorCss.js')(gulp, config, plugin, help);
require('./gulp/task-watch.js')(gulp, config, plugin, help);
require('./gulp/task-selectConfigXml.js')(gulp, config, plugin, help);
require('./gulp/task-release.js')(gulp, config, plugin, help);
require('./gulp/task-rebuild.js')(gulp, config, plugin, help);


*/


