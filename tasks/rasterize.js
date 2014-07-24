/*global require, module*/

var path = require("path"),
    async = require("async"),
    RSVP = require('rsvp'),
    svg2png = require('svg2png'),
    getSvgDimensions = require('../lib/getSvgDimensions'),
    chalk = require("chalk"),
    numCPUs = require("os").cpus().length;

function getSvgWidth(file) {
    return new RSVP.Promise(function (resolve, reject) {
        getSvgDimensions(file, function (dimensions) {
            if (dimensions && dimensions.width) {
                resolve(dimensions.width);
            } else {
                reject(dimensions);
            }
        });
    });
}

function getSvgWidths(files) {
    var promises = files.map(function (file) {
        return getSvgWidth(file.src);
    });
    return RSVP.all(promises);
}

module.exports = function (grunt) {

    grunt.registerMultiTask("rasterize", "Convert SVG to PNG", function () {

        var options = this.options({
                widths: [60],
                subdir: "",
                limit: Math.max(numCPUs, 2)
            }),
            self = this,
            output = [],
            fileIndex,
            filesLength = this.files.length,
            widthIndex,
            widthsLength = options.widths.length,
            svgWidth,
            finished = this.async(),
            scale = function (w, srcW) { return w / srcW; };

        grunt.log.writeln(chalk.blue('Finding Initial SVG Widths'));

        getSvgWidths(this.files).then(function (dimensions) {
            grunt.log.writeln(chalk.blue('Rasterizing:') + chalk.gray(filesLength + ' files'));
            grunt.log.writeln(chalk.blue('Expected Output:') + chalk.gray((filesLength * widthsLength) + ' files'));

            for (fileIndex = 0; fileIndex < filesLength; fileIndex++) {
                svgWidth = dimensions[fileIndex];
                for (widthIndex = 0; widthIndex < widthsLength; widthIndex++) {
                    output.push({
                        file : self.files[fileIndex],
                        width : options.widths[widthIndex],
                        scale : scale(options.widths[widthIndex], svgWidth)
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
            }, finished);

        }).catch(function (e) {
            grunt.log.error('An Error Occurred', e);
            finished(false);
        });
    });

};
