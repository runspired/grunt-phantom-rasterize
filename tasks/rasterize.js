/*global require, module*/

var path = require("path"),
    async = require("async"),
    svg2png = require('svg2png'),
    getSvgDimensions = require('../lib/getSvgDimensions'),
    chalk = require("chalk"),
    numCPUs = require("os").cpus().length;

module.exports = function (grunt) {

    grunt.registerMultiTask("rasterize", "Convert SVG to PNG", function () {

        var options = this.options({
                widths: [60],
                subdir: "",
                limit: Math.max(numCPUs, 2)
            }),
            output = [],
            fileIndex,
            filesLength = this.files.length,
            widthIndex,
            widthsLength = options.widths.length,
            dims,
            scale = function (w, srcW) { return w / srcW; };

        grunt.log.writeln(chalk.blue('Rasterizing:') + chalk.gray(filesLength + ' files'));
        grunt.log.writeln(chalk.blue('Expected Output:') + chalk.gray((filesLength * widthsLength) + ' files'));

        for (fileIndex = 0; fileIndex < filesLength; fileIndex++) {
            dims = getSvgDimensions(this.files[fileIndex]);
            for (widthIndex = 0; widthIndex < widthsLength; widthIndex++) {
                output.push({
                    file : this.files[fileIndex],
                    width : options.widths[widthIndex],
                    scale : scale(options.widths[widthIndex], dims.width)
                });
            }
        }

        async.eachLimit(output, options.limit, function (item, next) {
            var rootdir = path.dirname(item.file.src),
                pngFile = path.basename(item.file.src, ".svg") + '-' + item.width + ".png",
                dest = path.join(rootdir, options.subdir, pngFile);

            grunt.log.writeln(chalk.gray(dest) + ' ' + chalk.green(item.scale));

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
