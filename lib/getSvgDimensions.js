/*global module, require*/
const sizeOf = require('image-size');

module.exports = function getSvgDimensions(sourceFileName, cb) {

	let dimensions = sizeOf(sourceFileName[0]);
	return cb(dimensions);

};
