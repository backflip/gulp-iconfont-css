'use strict';

var path = require('path'),
	gutil = require('gulp-util'),
	through = require('through2'),
	swig = require('swig'),
	fs = require('fs');

module.exports = function (config) {
	var glyphMap = [],
		currentGlyph = config.firstGlyph || 0xE001,
		codepoint, filename, filenameNew, template, output;

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-iconfont-glyphmap', 'Streaming not supported'));
			return cb();
		}

		codepoint = currentGlyph.toString(16).toUpperCase();
		filename = path.basename(file.path, '.svg');
		filenameNew = path.dirname(file.path) + '/' + 'u' + codepoint + '-' + path.basename(file.path);

		glyphMap.push({
			filename: filename,
			codepoint: codepoint
		});

		fs.rename(file.path, filenameNew, function(err) {
			if (err) {
				gutil.log(err);
			} else {
				gutil.log("Saved codepoint: " + filename);
			}
		});

		currentGlyph++;

		this.push(file);

		cb();
	}, function (cb) {
		if (glyphMap.length) {
			if (!config.template) {
				this.emit('error', new gutil.PluginError('gulp-iconfont-glyphmap', 'No template specified'));
				return cb();
			}

			if (!config.outputFile) {
				this.emit('error', new gutil.PluginError('gulp-iconfont-glyphmap', 'No outputFile specified'));
				return cb();
			}

			template = swig.compileFile(path.resolve(config.template));

			output = template({
				glyphs: glyphMap
			});

			fs.writeFile(config.outputFile, output, function(err) {
				if(err) {
					gutil.log(err);
				} else {
					gutil.log("The codepoint mapping was saved to " + config.outputFile);
				}
			});
		}

		cb();
	});
};
