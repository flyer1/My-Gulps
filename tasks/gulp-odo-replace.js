var through = require('through2');
var rs = require('replacestream');
var path = require('path');

module.exports = function (fileReplacements) {
    var doReplace = function (file, enc, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        
        function getFileReplacements(files, fileToFind) {
            for (var i = 0; i < files.length; i++) {
                // we need to force the incoming path to look like a Windows path on a Mac as the path delimiters are different
                // using path.win32.normalize takes care of this for us                
                if (files[i].fileName === path.win32.normalize(fileToFind)) return files[i].replacements;
            }
            return null;
        }

        function doReplace(search, replacement) {
            if (file.isStream()) {
                file.contents = file.contents.pipe(rs(search, replacement));
            }
            else if (file.isBuffer()) {
                // WARNING - this code assumes there is only a single instance of this token within the file!
                file.contents = new Buffer(String(file.contents).replace(search, replacement));
            }
        }

        var replacements = getFileReplacements(fileReplacements, file.relative);
        if (replacements) {
            for (var i = 0; i < replacements.length; i++) {
                var replacement = replacements[i];
                doReplace(replacement.token, replacement.value);
            }

            callback(null, file);
        }
        else {
            callback(null, file);
        }
    };

    return through.obj(doReplace);
};