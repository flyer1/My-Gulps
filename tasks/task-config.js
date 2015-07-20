var args = require('yargs').argv;
var inquirer = require("inquirer");
var fs = require('fs');
var chalk = require('chalk');

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('config', {
        name: 'Configure [multiple options]',
        description: 'Gets or sets the configuration for the build process (ie: target the browser or the device, use the DEV or PROD servers, etc);\nAll future builds and rebuilds will use this configuration',
        primary: true,
        options: [
			{ name: '-l', description: 'list current configuration' },
			{ name: '-t [BROWSER | DEVICE]', description: 'set target; dictates which scripts get included in the build (ie: ng-cordova vs. ng-cordova-mocks)' },
			{ name: '-e [DEV | PROD]', description: 'set environment;  dictates which URLs are used by the mobile app' },
			{ name: '-p [IPHONE | IPAD | ANDROID | BLACKBERRY]', description: 'set platform; only used when deployed to the device; dictates config.xml and the deviceType settings' },
			{ name: '--min [YES | NO]', description: 'set minification OVERRIDE; if omitted then min. is set based on target' }
        ]
    });

    var doneCallback;
    var configData;

    gulp.task('config', function (done) {

        configData = {
            target: config.target,
            env: config.env,
            platform: config.platform,
            minify: config.minify
        };

        doneCallback = done;

        if (args.l) {
            console.log(chalk.green.bold('Current configuration ----------------------------------'));
            console.log(configData);
            console.log(chalk.green.bold('--------------------------------------------------------'));
            return;
        }

        if (manualConfigRequested()) {
            performManualConfig();
        } else {
            performPromptedConfig();
        }
    });

    function manualConfigRequested() {
        return args.t || args.e || args.p || args.min;
    }

    function manualConfigValid() {
        if (args.t && !(args.t.toUpperCase() === 'BROWSER' || args.t.toUpperCase() === 'DEVICE')) {
            console.log(chalk.red.bold('Target must either be BROWSER or DEVICE'));
            return false;
        }

        if (args.e && !(args.e.toUpperCase() === 'DEV' || args.e.toUpperCase() === 'PROD')) {
            console.log(chalk.red.bold('Environment must either be DEV or PROD'));
            return false;
        }

        if (args.p && !(args.p.toUpperCase() === 'IPHONE' || args.p.toUpperCase() === 'IPAD' || args.p.toUpperCase() === 'ANDROID' || args.p.toUpperCase() === 'BLACKBERRY')) {
            console.log(chalk.red.bold('Platform must either be IPHONE, IPAD, ANDROIDo or BLACKBERRY'));
            return false;
        }

        if (args.min && !(args.min.toUpperCase() === 'YES' || args.min.toUpperCase() === 'NO')) {
            console.log(chalk.red.bold('The minification override must be set to YES or NO;  (or leave it off to have it default based on the target)'));
            return false;
        }

        return true;
    }

    function performManualConfig() {
        if (manualConfigValid()) {

            if (args.t) {
                configData.target = args.t.toUpperCase();
                configData.minify = (args.t.toUpperCase() === 'DEVICE');
            }

            if (args.e) configData.env = args.e.toUpperCase();
            if (args.p) configData.platform = args.p.toUpperCase();
            if (args.min) configData.minify = (args.min.toUpperCase() === 'YES');


            saveConfigData();

            console.log(chalk.green.bold('Configuration CHANGE ----------------------------------'));
            console.log(configData);
            console.log(chalk.red.bold('CONFIGURATION UPDATED - you should run a GULP REBUILD'));
            console.log(chalk.green.bold('-------------------------------------------------------'));
        }
    }

    function performPromptedConfig() {
        help.printHelp('config');

        inquirer.prompt([
            { type: 'list', name: 'target', message: 'Target? ', default: config.target === 'BROWSER' ? 0 : 1, choices: [{ value: 'BROWSER', name: 'Browser' }, { value: 'DEVICE', name: 'Device' }] },
            { type: 'list', name: 'platform', message: 'Platform? ', default: config.platform === 'IPHONE' ? 0 : config.platform === 'IPAD' ? 1 : config.platform === 'ANDROID' ? 2 : 3, choices: [{ value: 'IPHONE', name: 'iPhone' }, { value: 'IPAD', name: 'iPad' }, { value: 'ANDROID', name: 'Android' }, { value: 'BLACKBERRY', name: 'BlackBerry' }] },
            { type: 'list', name: 'env', message: 'Environment? ', default: config.env === 'DEV' ? 0 : 1, choices: [{ value: 'DEV', name: 'Development (ie: UAT Server)' }, { value: 'PROD', name: 'Production' }] },
            { type: 'confirm', name: 'minify', message: 'Minify Source (recommended when performing a GULP RELEASE)? ', default:function (promptData) { return promptData.target === 'DEVICE'; } },
            { type: 'confirm', name: 'rebuild', message: 'Run the REBUILD task?', default: true }
        ], applyPromptedConfig);
    }

    function applyPromptedConfig(promptData) {

        configData.target = promptData.target;
        configData.env = promptData.env;
        configData.platform = promptData.platform;
        configData.minify = promptData.minify;
        saveConfigData();
        console.log(configData);

        if (promptData.rebuild) {
            performRebuild();
        } else {
            console.log(chalk.red.bold('CONFIGURATION UPDATED - you should run a GULP REBUILD'));
            doneCallback();
        }
    }
    
    function saveConfigData() {
        fs.writeFile('./config/gulp-config.json', JSON.stringify(configData));
    }

    function performRebuild() {
        // need to move the configData back into config prior to the rebuild, otherwise the old settings are used.
        config.target = configData.target;
        config.env = configData.env;
        config.platform = configData.platform;
        config.minify = configData.minify;

        var runSequence = require('run-sequence');
        runSequence('rebuild', doneCallback);
    }
};