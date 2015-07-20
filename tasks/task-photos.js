var chalk = require('chalk');
var fs = require('fs-extra');

module.exports = function (gulp, config, plugin, help) {

    var doneCallback;

    help.registerHelp('photos', {
        name: 'Organizes a set of photos',
        description: 'Reads the source folder and moves each photo to a new folder, organized by the year and month of the creation date (TARGET_PATH/YYYY/MM/FILENAME.ext)',
    });

    gulp.task('photos', function (done) {
        // TODO: support command line args to control which type of image files to filter?
        // Collect up all of the image files in the source folder.
        // For each file:
        //  - Figure out the creation time
        //  - Ensure that the year exists as a folder in the target folder
        //  - Ensure that the month exists as a folder in the target folder (can do the last 2 in one step?)
        //  - Move the file to the target/yyyy/mm
        console.log(config);
        doneCallback = done;
     
    });

    //// #region Build CORDOVA    
    //function validCordova() {
    //    if (!sh.which('cordova')) {
    //        console.log(chalk.red.bold('Missing cordova'));
    //        console.log(chalk.bold('Cordova is part of the Cordova CLI - if this is not found, your environment is seriously screwed up...'));
    //        return false;
    //    }
    //    return true;
    //}

    //function buildCordova(platform) {
    //    var cordovaExec = 'cordova build ' + platform + ' --release';
    //    console.log(chalk.green.bold('Executing cordova - I hope you did a GULP REBUILD before running this task:'));
    //    console.log(chalk.bold(cordovaExec));

    //    var result = sh.exec(cordovaExec);
    //    if (result.code !== 0) {
    //        console.log(chalk.red.bold('Cordova no luv u long time...'));
    //    }

    //    return result.code === 0;
    //}
    //// #endregion

    ////#region Build ANDROID
    //var apkFolder = '../Release/Android';

    //function buildANDROID(releaseFolder) {

    //    if (!validCordova() || !validAndroidBuildEnv()) return;

    //    if (!buildCordova('android')) return;

    //    apkFolder = releaseFolder;

    //    fs.emptyDirSync(apkFolder);
    //    fs.copySync('./platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk', apkFolder +'/android-armv7-release-unsigned.apk');
    //    fs.copySync('./platforms/android/build/outputs/apk/android-x86-release-unsigned.apk', apkFolder + '/android-x86-release-unsigned.apk');

    //    if (jarsigner('android-armv7-release-unsigned.apk', 'OTMPC-Mobile-Release-armv7-unaligned.apk')) {
    //        if (zipalign('OTMPC-Mobile-Release-armv7-unaligned.apk', 'OTMPC-Mobile-Release-armv7.apk')) {
    //            fs.removeSync(apkFolder + '/android-armv7-release-unsigned.apk');
    //            fs.removeSync(apkFolder + '/OTMPC-Mobile-Release-armv7-unaligned.apk');
    //        }
    //    }

    //    if (jarsigner('android-x86-release-unsigned.apk', 'OTMPC-Mobile-Release-x86-unaligned.apk')) {
    //        if (zipalign('OTMPC-Mobile-Release-x86-unaligned.apk', 'OTMPC-Mobile-Release-x86.apk')) {
    //            fs.removeSync(apkFolder + '/android-x86-release-unsigned.apk');
    //            fs.removeSync(apkFolder + '/OTMPC-Mobile-Release-x86-unaligned.apk');
    //        }
    //    }

    //    doneCallback();
    //}

    //function validAndroidBuildEnv() {
    //    if (!sh.which('jarsigner')) {
    //        console.log(chalk.red.bold('Missing jarsigner'));
    //        console.log(chalk.bold('The jarsigner application is part of the JDK:\n' +
    //                               '1. Ensure you  have JDK installed (v1.8.25 or higher)\n' +
    //                               '2. Verify that you have the %JAVA_HOME% environment variable declared and have %JAVA_HOME%\\bin in your path'));
    //        return false;
    //    }

    //    if (!sh.which('zipalign')) {
    //        console.log(chalk.red.bold('Missing zipalign'));
    //        console.log(chalk.bold('The zipalign application is part of the Android SDK; specifically the Build Tools:\n' +
    //                                '1. Ensure you have Android SDK installed \n' +
    //                                '2. Ensure you have v22.0.1 (or higher) of the Android SDK Build-tools installed (run the ANDROID command to verify)\n' +
    //                                '3. Ensure you have the SDK build tools folder in your path (ie: C:\\Android\\sdk\\build-tools\\22.0.1)'));
    //        return false;
    //    }

    //    return true;
    //}

    //function jarsigner(unsignedApkFileName, signedApkFileName) {
    //    var keystorePath = '../Signing/Android/DiscoverOntario/mythum_olson.keystore';
    //    var keystorePassword = 'mti20080818';
    //    var aliasName = 'mythum_olson';
    //    var unsignedApkFile = apkFolder + '/' + unsignedApkFileName;
    //    var signedApkFile = apkFolder + '/' + signedApkFileName;

    //    var jarsignerExec = 'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ' + keystorePath +
    //                        ' -storepass ' + keystorePassword +
    //                        ' -keypass ' + keystorePassword + ' ' +
    //                        unsignedApkFile + ' ' +
    //                        aliasName + ' ' +
    //                        '-signedjar ' + signedApkFile;

    //    console.log(chalk.green.bold('Executing jarsigner:'));
    //    console.log(chalk.bold(jarsignerExec));

    //    var result = sh.exec(jarsignerExec);

    //    if (result.code !== 0) {
    //        console.log(chalk.red.bold('Oh noes!  You are headed for a disaster of biblical proportions!\nHuman sacrifice, dogs and cats living together... mass hysteria!'));
    //    }

    //    return result.code === 0;
    //}

    //function zipalign(unalignedApkFileName, alignedApkFileName) {

    //    var unalignedApkFile = apkFolder + '/' + unalignedApkFileName;
    //    var alignedApkFile = apkFolder + '/' + alignedApkFileName;

    //    var zipalignExec = 'zipalign.exe -v 4 ' + unalignedApkFile + ' ' + alignedApkFile;
    //    console.log(chalk.green.bold('Executing zipalign:'));
    //    console.log(chalk.bold(zipalignExec));

    //    var result = sh.exec(zipalignExec);

    //    if (result.code !== 0) {
    //        console.log(chalk.red.bold('WARNING! The dilithium crystals are out of alignment!\nWarp core breach imminent!'));
    //    }

    //    return result.code === 0;
    //}
    ////#endregion

    //function buildIOS() {
    //    if (!validCordova() || !validAppleBuildEnv()) return;

    //    if (!buildCordova('ios')) return;

    //    console.log('ios build coming soon');

    //    doneCallback();
    //}

    //function validAppleBuildEnv() {

    //    // darwin === mac - how unexpected.
    //    if (process.platform !== "darwin") {
    //        console.log(chalk.red.bold('Missing MAC'));
    //        console.log(chalk.bold('So um, yah dude...  iOS builds need to be done on a Mac;  if you figure out how to get it running on Windows, please let me know!'));
    //        return false;
    //    }

    //    return true;
    //}
};