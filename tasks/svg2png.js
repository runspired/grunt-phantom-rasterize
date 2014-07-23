
"use strict";

/*global require, module*/

var path = require("path"),
    async = require("async"),
    svg2png = require("svg2png"),
    chalk = require("chalk"),
    numCPUs = require("os").cpus().length;

module.exports = function (grunt) {

    grunt.registerMultiTask("svg2png", "Convert SVG to PNG", function () {
        var options = this.options({
                scales: [1.0],
                subdir: "",
                limit: Math.max(numCPUs, 2)
            }),
            output = {},
            fileIndex,
            filesLength = this.files.length,
            scaleIndex,
            scalesLength = options.scales.length,
            newFileIndex;

        for (fileIndex = 0; fileIndex < filesLength; fileIndex++) {
            for (scaleIndex = 0; scaleIndex < scalesLength; scaleIndex++) {
                newFileIndex = this.files[fileIndex] + '_' + options.scales[scaleIndex];
                output[newFileIndex] = {
                    file : this.files[fileIndex],
                    scale : options.scales[scaleIndex]
                };
            }
        }

        async.eachLimit(output, options.limit, function (item, next) {
            var rootdir = path.dirname(item.file.src),
                pngFile = path.basename(item.file.src, ".svg") + ".png",
                dest = path.join(rootdir, options.subdir, pngFile);

            svg2png(item.file.src, dest, item.scale, function (err) {
                if (err) {
                    grunt.log.error("An error occurred converting %s in %s: %s", item.file.src, dest, err);
                } else {
                    grunt.log.writeln(chalk.green("✔ ") + dest + chalk.gray(" (scale:", item.scale + ")"));
                }
                next();
            });
        }, this.async());
    });

};
