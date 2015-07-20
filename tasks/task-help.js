
var chalk = require('chalk');
var FONTS = require('cfonts');

module.exports = function (gulp) {

	var help = {};

	gulp.task('help', function (done) {
		printAllHelp();
		done();
	});

	var service = {
		printAllHelp: printAllHelp,
		printHelp: printHelp,
		registerHelp: registerHelp
	};

	return service;

	/* -------------------- IMPLEMENTATION ----------------------------------------- */
	function printAllHelp() {

		var maxCol = 120;

		wl('');
		showBanner();

		wl(chalk.white.bold(pad('', maxCol)));
		wl('');

		dumpList();
	}

	function showBanner() {
		var fonts = new FONTS({
			'text': 'MY GULPS', //text to be converted 
			'font': 'block', //define the font face 
			'colors': ['magenta', 'magenta'], //define all colors 
			'background': 'Black', //define the background color 
			'letterSpacing': 1, //define letter spacing 
			'space': false, //define if the output text should have empty lines on top and on the bottom 
			'maxLength': '20' //define how many character can be on one line 
		});

	}

	function dumpList() {

		var maxCol = 120;

		var keys = Object.keys(help),
				   i, len = keys.length;
		keys.sort();

		for (i = 0; i < len; i++) {
			var taskHelp = help[keys[i]];
			w(chalk.yellow.bold(pad(keys[i] + ':',12, ' ')));
			wl(chalk.bold(taskHelp.name));
			wl(chalk.bold(taskHelp.description));
			//wl(chalk.bold(pad('', maxCol)));
		}
	}

	// TODO: test this
	function printHelp(taskName) {

		showBanner();

		var maxCol = 120,
			option,
			task;

		task = help[taskName];
		wl(chalk.green.bold(pad(task.name + ' Help ', maxCol)));

		wl(chalk.bold(task.description));

		if (task.options && task.options.length > 0) {
			wl(chalk.yellow.bold(pad('Options ', maxCol)));
			for (var i = 0; i < task.options.length; i++) {
				option = task.options[i];

				w('     ' + chalk.green.bold(option.name));
				w(pad('  ', 40 - option.name.length - 5, '.'));
				wl(chalk.bold(option.description));
			}
		}

		wl(chalk.green.bold(pad('', maxCol)));
	}

	function registerHelp(name, helpData) {
		help[name] = helpData;
	}

	function w(s) {
		process.stdout.write(s);
	}

	function wl(s) {
		process.stdout.write(s + '\n');
	}

	function pad(s, l, c) {
		while (s.length < l) s += c || '_';
		return s;
	}
};