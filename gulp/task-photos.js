var args = require('yargs').argv;
var chalk = require('chalk');
var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var pretty = require('prettysize');

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('photos', {
        name: 'Organizes a set of photos',
        description: 'Reads the source folder and moves each photo to a new folder, organized by the year and month of the creation date (TARGET_PATH/YYYY/MM/FILENAME.ext)',
        options: [
           { name: '-help', description: 'displays this help' },
           { name: '-simulate', description: 'simulates what the process would do without actually creating or moving anything' },
           { name: '-quiet', description: "don't be so chatty about every step taken" },
        ]
    });

    gulp.task('photos', function (done) {

        try {
            var files = [];
            var summary = {
                totalFiles: 0,
                filesProcessed: 0,
                filesProcessedSize: 0,
                filesSkipped: 0,
                filesWithErrors: 0
            };
            var fileInfo;
            var ext;

            help.printHelp('photos');
            if (args.help) return;

            if (!preProcess()) return;

            processFiles();

            postProcess();
        } catch (e) {
            console.log(chalk.red('Error has occurred', e));
        }

        ///////////////////////////////////////////

        function preProcess() {

            files = fs.readdirSync(config.photos.paths.source).filter(filterFiles);

            if (files.length === 0) {
                console.log('No files to process. Quiting...');
                return false;
            }

            summary.totalFiles = files.length + summary.filesSkipped;

            // Ensure that the destination base path exists
            if (!fs.existsSync(config.photos.paths.dest)) {
                console.log(chalk.gray('Creating destination base path...' + (args.simulate ? "(simulating)": "")));
                if (!args.simulate) {
                    fs.mkdirSync(config.photos.paths.dest);
                }
            }

            return true;

            ///////

            function filterFiles(fileName) {
                ext = path.extname(fileName).substring(1).toLowerCase();
                if (_.contains(config.photos.supportedTypes, ext)) {
                    return true;
                } else {
                    console.log(chalk.yellow("Warning: skipping:"), chalk.gray(fileName));
                    summary.filesSkipped += 1;
                    return false;
                }
            }
        }

        function processFiles() {
            console.log('\n');
            console.log(chalk.white("Processing ") + chalk.green.bold(files.length) + chalk.white(" files..."));
            console.log(chalk.green(pad('', 100, '-')));

            _.forEach(files, function (fileName) {
                fileInfo = getFileInfo(fileName);
                ensurePathExists(fileInfo);
                processFile(fileInfo);
            });
        }

        function ensurePathExists(fileInfo) {
            var destPath = path.join(config.photos.paths.dest, fileInfo.year);
            if (!fs.existsSync(destPath)) {
                console.log(chalk.gray('Creating destination path (year)...' + destPath + (args.simulate ? " (simulating)": "")));
                if (!args.simulate) {
                    fs.mkdirSync(path.join(destPath));
                }
            }

            destPath = path.join(config.photos.paths.dest, fileInfo.year, fileInfo.month);
            if (!fs.existsSync(destPath)) {
                console.log(chalk.gray('Creating destination path (month)...' + destPath + (args.simulate ? " (simulating)": "")));
                if (!args.simulate) {
                    fs.mkdirSync(destPath);
                }
            }
        }

        function processFile(fileInfo) {
            var options = {
                "clobber": false,
                "preserveTimestamps": true,
            };

            try {
                if (!args.quiet) {
                    console.log(chalk.white(args.simulate ? 'Simulating: ' : 'Processing: ') + chalk.cyan(fileInfo.destPath) + chalk.white('...'));
                }
                if (!args.simulate) {
                    fs.copySync(fileInfo.sourcePath, fileInfo.destPath, options);
                    fs.removeSync(fileInfo.sourcePath);
                    summary.filesProcessed += 1;
                    summary.filesProcessedSize += fileInfo.size;
                }
            } catch (e) {
                console.log(chalk.red.bold(pad(e + " " + fileInfo.fileName, 100, '-')));
                summary.filesWithErrors += 1;
            }
        }

        function getFileInfo(fileName) {

            var fileInfo = {
                fileName: "",
                year: "0000",
                month: "00",
                sourcePath: "",
                destPath: "",
                destFolder: "",
                size: 0,
            };

            fileInfo.sourcePath = path.join(config.photos.paths.source, fileName);
            var stat = fs.statSync(fileInfo.sourcePath);

            var creationTime = new Date(stat.birthtime);
            fileInfo.year = creationTime.getFullYear().toString();
            fileInfo.month = ("0" + (creationTime.getMonth() + 1)).slice(-2);
            fileInfo.fileName = fileName;
            fileInfo.destFolder = path.join(config.photos.paths.dest, fileInfo.year, fileInfo.month);
            fileInfo.destPath = path.join(fileInfo.destFolder, fileName);
            fileInfo.size = stat.size;

            return fileInfo;
        }

        function postProcess() {
            console.log('\n');
            console.log(chalk.yellow.bold(pad("  SUMMARY " + (args.simulate ? "(simulated)" : ""), 100, '-')));
            console.log(chalk.green.bold("    Total Files: " + summary.totalFiles));
            console.log(chalk.green.bold("    Files Processed: " + summary.filesProcessed));
            console.log(chalk.green.bold("    Files Processed Size: " + pretty(summary.filesProcessedSize)));
            console.log(chalk.green.bold("    Files Skipped: ") + chalk.yellow.bold(summary.filesSkipped));
            console.log(chalk.green.bold("    Errors: ") + chalk.red.bold(summary.filesWithErrors));
        }

        function pad(s, l, c) {
            while (s.length < l) s += c || '_';
            return s;
        }

    });

};
