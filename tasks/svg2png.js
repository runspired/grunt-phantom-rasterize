
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
                widths: [60],
                svgWidth: [60]
                subdir: "",
                limit: Math.max(numCPUs, 2)
            }),
            output = {},
            fileIndex,
            filesLength = this.files.length,
            widthIndex,
            widthsLength = options.widths.length,
            newFileIndex,
            scale = function (w) { return w/options.svgWidth; };

        for (fileIndex = 0; fileIndex < filesLength; fileIndex++) {
            for (widthIndex = 0; widthIndex < widthsLength; widthIndex++) {
                newFileIndex = this.files[fileIndex] + '_' + options.widths[widthIndex];
                output[newFileIndex] = {
                    file : this.files[fileIndex],
                    scale : scale(options.widths[widthIndex])
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
