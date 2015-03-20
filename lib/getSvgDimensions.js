/*global module, require*/
var path = require("path");
var execFile = require("child_process").execFile;
var phantomjsCmd = require("phantomjs").path;
var getSvgDim = path.resolve(__dirname, "./getter.js");

module.exports = function getSvgDimensions(sourceFileName, cb) {

  var args = [getSvgDim, sourceFileName];

  execFile(phantomjsCmd, args, function (err, stdout, stderr) {

    if (err) { return cb(err); }

    try {
      var data = JSON.parse(stdout);
      return cb(data);
    } catch (e) {
      return cb(stdout);
    }

  });

};
