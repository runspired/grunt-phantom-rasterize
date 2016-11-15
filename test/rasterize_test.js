/*global require, describe, it*/
var fs = require("fs"),
  assert = require("assert"),
  sizeOf = require("image-size");

describe("svg2png", function () {

  it("Creats Subdirectory for new icons", function () {
    assert(fs.existsSync("test/svg/png"));
    assert(fs.existsSync("test/svg/png_2x"));
    assert(fs.existsSync("test/svg/png_3x"));
  });

  it("Generates PNG Files", function () {
    assert(fs.existsSync("test/svg/png/test-60.png"));
    assert(fs.existsSync("test/svg/png_2x/icon@2x.png"));
    assert(fs.existsSync("test/svg/png_3x/icon@3x.png"));
  });

  it("Generates PNG from fallback options.", function () {
    var dimensions = sizeOf("test/svg/png/test-60.png");
    assert(dimensions.width === 60);
    assert(dimensions.height === 60);
  });

  it("Generates PNG from specified options.", function () {
    var dimensions = sizeOf("test/svg/png_2x/icon@2x.png");
    assert(dimensions.width === 128);
    assert(dimensions.height === 128);
  });

  it("Generates PNG from specified options using the correct directory", function () {
    var dimensions = sizeOf("test/svg/png_3x/icon@3x.png");
    assert(dimensions.width === 192);
    assert(dimensions.height === 192);
  });

});
