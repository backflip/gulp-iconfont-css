'use strict';

var path = require('path'),
	gutil = require('gulp-util'),
	consolidate = require('consolidate'),
	_ = require('lodash'),
	Stream = require('stream');

var PLUGIN_NAME  = 'gulp-iconfont-css';

function iconfontCSS(config) {
	var glyphMap = [],
		currentGlyph,
		inputFilePrefix,
		stream,
		outputFile,
		engine;

	// Set default values
	config = _.merge({
		path: __dirname + '/_icons.scss',
		targetPath: '_icons.scss',
		engine: 'lodash',
		firstGlyph: 0xE001
	}, config);

	// Validate config
	if (!consolidate[config.engine]) {
		throw new gutil.PluginError(PLUGIN_NAME, 'Consolidate missing template engine "' + config.engine + '"');
	}
	try {
		engine = require(config.engine);
	} catch(e) {
		throw new gutil.PluginError(PLUGIN_NAME, 'Template engine "' + config.engine + '" not present');
	}

	// Define starting point
	currentGlyph = config.firstGlyph;

	// Happy streaming
	stream = Stream.PassThrough({
		objectMode: true
	});

	stream._transform = function(file, unused, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		// Create output file
		if (!outputFile) {
			outputFile = new gutil.File({
				base: file.base,
				cwd: file.cwd,
				path: path.join(file.base, config.targetPath),
				contents: file.isBuffer() ? new Buffer(0) : new Stream.PassThrough()
			});
		}

		// Add glyph
		glyphMap.push({
			filename: path.basename(file.path, '.svg'),
			codepoint: currentGlyph
		});

		// Prepend codepoint to input file path for gulp-iconfont
		inputFilePrefix = 'u' + (currentGlyph).toString(16).toUpperCase() + '-';

		file.path = path.dirname(file.path) + '/' + inputFilePrefix + path.basename(file.path);

		// Increase counter
		currentGlyph++;

		this.push(file);
		cb();
	};

	stream._flush = function(cb) {
		var content;

		if (glyphMap.length) {
			consolidate[config.engine](config.path, {
					glyphs: glyphMap
				}, function(error, html) {
					if (error) {
						throw error;
					}

					content = Buffer(html);

					if (outputFile.isBuffer()) {
						outputFile.contents = content;
					} else {
						outputFile.contents.write(content);
						outputFile.contents.end();
					}

					stream.push(outputFile);

					cb();
			});
		} else {
			cb();
		}
	};

	return stream;
};

module.exports = iconfontCSS;
