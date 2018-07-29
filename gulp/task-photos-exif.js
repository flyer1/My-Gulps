var args = require('yargs').argv;
var chalk = require('chalk');
var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var pretty = require('prettysize');
var exif = require('exif');

module.exports = function (gulp, config, plugin, help) {

    help.registerHelp('photos-exif', {
        name: 'Organizes a set of photos using EXIF data to get create date',
        description: 'Reads the source folder and moves each photo to a new folder, organized by the year and month of the creation date from EXIF (TARGET_PATH/YYYY/MM/FILENAME.ext)',
        options: [{
                name: '-help',
                description: 'displays this help'
            },
            {
                name: '-simulate',
                description: 'simulates what the process would do without actually creating or moving anything'
            },
            {
                name: '-quiet',
                description: "don't be so chatty about every step taken"
            },
        ]
    });

    gulp.task('photos-exif', function (done) {

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
            var fileInfos = [];
            var ext;

            help.printHelp('photos');
            if (args.help) return;

            if (!preProcess()) return;

            buildFileInfos().then(function () {
                console.log('processing files..');
                processFiles();
                postProcess();
            });
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
                console.log(chalk.gray('Creating destination base path...' + (args.simulate ? "(simulating)" : "")));
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

        function buildFileInfos() {
            var promise = new Promise(function(resolve, reject) {
                for(var i=0; i<files.length; i++) {
                    buildFileInfo(files[i]).then(function(result) {
                        if (files.length === fileInfos.length)  {
                            console.log('time to resolve!')
                            resolve();
                        }
                    });
                }
            });

            return promise;
        }

        function processFiles() {
            console.log('\n');
            console.log(chalk.white("Processing ") + chalk.green.bold(files.length) + chalk.white(" files..."));
            console.log(chalk.green(pad('', 100, '-')));

            _.forEach(fileInfos, function (fileInfo) {
                ensurePathExists(fileInfo);
                processFile(fileInfo);
            });
        }

        function ensurePathExists(fileInfo) {
            var destPath = path.join(config.photos.paths.dest, fileInfo.year);
            if (!fs.existsSync(destPath)) {
                console.log(chalk.gray('Creating destination path (year)...' + destPath + (args.simulate ? " (simulating)" : "")));
                if (!args.simulate) {
                    fs.mkdirSync(path.join(destPath));
                }
            }

            destPath = path.join(config.photos.paths.dest, fileInfo.year, fileInfo.month);
            if (!fs.existsSync(destPath)) {
                console.log(chalk.gray('Creating destination path (month)...' + destPath + (args.simulate ? " (simulating)" : "")));
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
                    if (!fs.existsSync(fileInfo.destPath)) {
                        fs.copySync(fileInfo.sourcePath, fileInfo.destPath, options);
                        fs.removeSync(fileInfo.sourcePath);
                        summary.filesProcessed += 1;
                        summary.filesProcessedSize += fileInfo.size;
                    } else {
                        var stat = fs.statSync(fileInfo.destPath);
                        if (stat.size === fileInfo.size) {
                            console.log(chalk.red('Destination file of same size/name already exists. Moving to trash', fileInfo.fileName, fileInfo.size, stat.size, fileInfo.sourcePath, config.photos.paths.trash));
                            options.clobber = true;
                            fs.copySync(fileInfo.sourcePath, path.join(config.photos.paths.trash, fileInfo.fileName), options);
                            fs.removeSync(fileInfo.sourcePath);
                            summary.filesWithErrors += 1;
                        } else {
                            fileInfo.fileCopy++;
                            var newDestPath = path.join(fileInfo.destFolder, fileInfo.fileName.replace('.' + fileInfo.ext, '-.' + fileInfo.fileCopy + fileInfo.ext));
                            console.log(chalk.yellow('A file with the same name exists but the size is different!', fileInfo.fileName, fileInfo.size, stat.size, 'Saving with new name', newDestPath));
                            fileInfo.destPath = newDestPath;
                            processFile(fileInfo);
                        }
                    }
                }
            } catch (e) {
                console.log(chalk.red.bold(pad(e + " " + fileInfo.fileName, 100, '-')));
                summary.filesWithErrors += 1;
            }
        }

        function buildFileInfo(fileName) {

            var fileInfo = {
                fileName: fileName,
                createDate: null,
                ext: "",
                year: "0000",
                month: "00",
                sourcePath: "",
                destPath: "",
                destFolder: "",
                size: 0,
                fileCopy: 1
            };

            fileInfo.sourcePath = path.join(config.photos.paths.source, fileName);
            
            var promise = new Promise(function (resolve, reject) {
                getExifData(fileInfo).then(function (fileInfo) {
                    fileInfo.year = fileInfo.createDate.substring(0,4);
                    fileInfo.month = fileInfo.createDate.substring(5,7);
                    fileInfo.destFolder = path.join(config.photos.paths.dest, fileInfo.year, fileInfo.month);
                    fileInfo.ext = path.extname(fileInfo.fileName).substring(1);
                    fileInfo.destPath = path.join(fileInfo.destFolder, fileInfo.fileName);
                    var stat = fs.statSync(fileInfo.sourcePath);
                    fileInfo.size = stat.size;
                    console.log('Got EXIF, resolving to: ', fileInfo);
                    fileInfos.push(fileInfo);
                    resolve();
                });
            });

            return promise;
        }

        function getExifData(fileInfo) {
            var promise = new Promise(function (resolve, reject) {
                // Getting EXIF data is an asynchronous call to mess up an otherwise synchronous GULP task. 
                var _fileInfo = fileInfo;
                new exif({ image: _fileInfo.sourcePath}, function (error, exifData) {
                    if (error) {
                        console.log('EXIF Error: ' + error.message);
                    } else {
                        console.log('Got EXIF data! ', exifData.exif.CreateDate);
                        _fileInfo.createDate = exifData.exif.CreateDate;
                        resolve(_fileInfo);
                    }
                });
            });
            return promise;
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