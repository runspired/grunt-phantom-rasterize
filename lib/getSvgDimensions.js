/*global module, require*/
var path = require("path"),
    execFile = require("child_process").execFile,
    phantomjsCmd = require("phantomjs").path,
    getSvgDim = path.resolve(__dirname, "./getter.js");

module.exports = function getSvgDimensions(sourceFileName, cb) {

    var args = [getSvgDim, sourceFileName];
    execFile(phantomjsCmd, args, function (err, stdout, stderr) {
        if (err) {
            cb(err);
        } else if (stdout.length > 0) { // PhantomJS always outputs to stdout.
            cb(new Error(stdout.toString().trim()));
        } else if (stderr.length > 0) { // But hey something else might get to stderr.
            cb(new Error(stderr.toString().trim()));
        } else {
            cb(null);
        }
    });
};