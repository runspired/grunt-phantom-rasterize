/*global require, describe, it*/
var fs = require("fs"),
    assert = require("assert"),
    sizeOf = require("image-size");

describe("svg2png", function () {

    it("Creats Subdirectory for new icons", function () {
        assert(fs.existsSync("test/svg/png"));
        assert(fs.existsSync("test/svg/png_2x"));
    });

    it("Generates PNG", function () {
        assert(fs.existsSync("test/svg/png/test.png"));
        assert(fs.existsSync("test/svg/png_2x/test.png"));
    });

    it("Generates PNG from fallback options.", function () {
        var dimensions = sizeOf("test/svg/png/test.png");
        assert(dimensions.width === 60);
        assert(dimensions.height === 60);
    });

    it("Generates PNG from specified options.", function () {
        var dimensions = sizeOf("test/svg/png_2x/test.png");
        assert(dimensions.width === 128);
        assert(dimensions.height === 128);
    });

});
