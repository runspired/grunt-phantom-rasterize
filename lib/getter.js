/*global require, console, convert, phantom: false*/

var webpage = require("webpage");

if (phantom.args.length !== 3) {
    console.error("Usage: getter.js source");
    phantom.exit();
} else {
    getDimensions(phantom.args[0]);
}

function getDimensions(source) {
    var page = webpage.create();

    page.open(source, function (status) {
        if (status !== "success") {
            console.error("Unable to load the source file.");
            phantom.exit();
            return;
        }

        try {
            return page.evaluate(function () {
                /*global document: false*/

                var el = document.documentElement,
                    bbox = el.getBBox(),

                    width = parseFloat(el.getAttribute("width")),
                    height = parseFloat(el.getAttribute("height")),
                    hasWidthOrHeight = width || height,
                    viewBoxWidth = el.viewBox.animVal.width,
                    viewBoxHeight = el.viewBox.animVal.height,
                    usesViewBox = viewBoxWidth && viewBoxHeight;

                if (usesViewBox) {
                    if (width && !height) {
                        height = width * viewBoxHeight / viewBoxWidth;
                    }
                    if (height && !width) {
                        width = height * viewBoxWidth / viewBoxHeight;
                    }
                    if (!width && !height) {
                        width = viewBoxWidth;
                        height = viewBoxHeight;
                    }
                }

                if (!width) {
                    width = bbox.width + bbox.x;
                }
                if (!height) {
                    height = bbox.height + bbox.y;
                }

                return { width: width, height: height, shouldScale: hasWidthOrHeight || !usesViewBox };
            });
        } catch (e) {
            console.error("Unable to calculate dimensions.");
            console.error(e);
            phantom.exit();
            return;
        }

    });
}