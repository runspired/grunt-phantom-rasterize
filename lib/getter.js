/*global require, console, convert, phantom: false*/

var webpage = require("webpage");

if (phantom.args.length !== 1) {

  console.error("Usage: getter.js source");
  phantom.exit();

} else {
  getDimensions(phantom.args[0]);
}



/**!
 *
 * @param {String} source the source image
 */
function getDimensions(source) {
  var page = webpage.create();

  page.open(source, function (status) {

    if (status !== "success") {
      console.error("Unable to load the source file.");
      phantom.exit();
      return;
    }

    try {

      var dimensions = page.evaluate(function () {

        console.error("Evaluating Source File");
        /*global document: false*/

        var el = document.documentElement;
        var bbox = el.getBBox();

        var width = parseFloat(el.getAttribute("width"));
        var height = parseFloat(el.getAttribute("height"));
        var hasWidthOrHeight = width || height;
        var viewBoxWidth = el.viewBox.animVal.width;
        var viewBoxHeight = el.viewBox.animVal.height;
        var usesViewBox = viewBoxWidth && viewBoxHeight;

        if (usesViewBox) {

          if (width && !height) {
            height = width * viewBoxHeight / viewBoxWidth;

          } else if (height && !width) {
            width = height * viewBoxWidth / viewBoxHeight;

          } else if (!width && !height) {
            width = viewBoxWidth;
            height = viewBoxHeight;

          }

        }

        width = width || bbox.width + bbox.x;
        height = height || bbox.height + bbox.y;

        return {
          width: width,
          height: height,
          shouldScale: hasWidthOrHeight || !usesViewBox
        };

      });

      console.log(JSON.stringify(dimensions));
      phantom.exit();
      return;

    } catch (e) {
      console.error("Unable to calculate dimensions.");
      console.error(e);
      phantom.exit();
      return;

    }

  });
}
