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
		currentCodePoint,
		inputFilePrefix,
		stream,
		outputFile,
		engine,
		cssClass;

	// Set default values
	config = _.merge({
		path: 'css',
		targetPath: '_icons.css',
		fontPath: './',
		engine: 'lodash',
		firstGlyph: 0xE001,
		fixedCodepoints: false,
		cssClass: 'icon',
		aliases: {},
		cacheBuster: ''
	}, config);

	// Enable default stylesheet generators
	if(!config.path) {
		config.path = 'scss';
	}
	if(/^(scss|less|css)$/i.test(config.path)) {
		config.path = __dirname + '/templates/_icons.' + config.path;
	}

	// Validate config
	if (!config.fontName) {
		throw new gutil.PluginError(PLUGIN_NAME, 'Missing option "fontName"');
	}
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
		var fileName;

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

		fileName = path.basename(file.path, '.svg');

		if (config.fixedCodepoints && config.fixedCodepoints[fileName]) {
			currentCodePoint = config.fixedCodepoints[fileName].toString(16).toUpperCase();
		} else {
			currentCodePoint = (currentGlyph++).toString(16).toUpperCase();
		}

		// Add glyph
		glyphMap.push({
			fileName: fileName,
			codePoint: currentCodePoint
		});

		if (config.aliases[fileName]) {
			_.each(config.aliases[fileName], function(_alias) {
				glyphMap.push({
					fileName: _alias,
					codePoint: currentCodePoint,
					originalFileName: fileName // used for less and scss
				});
			})
		}

		// Prepend codePoint to input file path for gulp-iconfont
		inputFilePrefix = 'u' + currentCodePoint + '-';

		file.path = path.dirname(file.path) + '/' + inputFilePrefix + path.basename(file.path);

		this.push(file);
		cb();
	};

	stream._flush = function(cb) {
		var content;
		if (glyphMap.length) {
			consolidate[config.engine](config.path, {
					glyphs: glyphMap,
					fontName: config.fontName,
					fontPath: config.fontPath,
					cssClass: config.cssClass,
					cacheBuster: config.cacheBuster,
					cacheBusterQueryString: config.cacheBuster ? '?' + config.cacheBuster : ''
				}, function(err, html) {
					if (err) {
						throw new gutil.PluginError(PLUGIN_NAME, 'Error in template: ' + err.message);
					}

					// TODO: remove condition and the else block for version 3.0
					if( Buffer.from ){
						content = Buffer.from(html);
					}else{
						content = Buffer(html);
					}

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
