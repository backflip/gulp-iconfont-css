'use strict';

var path = require('path'),
	gutil = require('gulp-util'),
	swig = require('swig'),
	fs = require('fs'),
	Stream = require('stream');

var PLUGIN_NAME  = 'gulp-iconfont-scss';

function iconfontSCSS(config) {
  var glyphMap = [], currentGlyph, stream, outputFile;

  // Checking config
  config = config || {};
	if (!config.template) {
		throw new gutil.PluginError(PLUGIN_NAME, 'No template specified');
	}
	if (!config.filename) {
		throw new gutil.PluginError(PLUGIN_NAME, 'No filename specified');
	}

  currentGlyph = config.firstGlyph || 0xE001;

	stream = Stream.PassThrough({objectMode: true});

  stream._transform = function(file, unused, cb) {
    if(file.isNull()) {
      this.push(file);
      return cb();
    }

    // Create the output file if none yet
    if(!outputFile) {
      outputFile = new gutil.File({
        base: file.base,
        cwd: file.cwd,
        path: path.join(file.base, config.filename + '.scss'),
        contents: file.isBuffer() ? new Buffer(0) : new Stream.PassThrough()
  		});
    }

    // Adding glyph
		glyphMap.push({
			filename: path.basename(file.path, '.svg'),
			codepoint: currentGlyph
		});

    // Changing file path
		file.path = path.dirname(file.path) + '/' + 'u'
		  + (currentGlyph++).toString(16).toUpperCase()
		  + '-' + path.basename(file.path);

		this.push(file);
		cb();
	};

  stream._flush = function (cb) {
    var template, content;
		if (glyphMap.length) {
			template = swig.compileFile(path.resolve(config.template));

			content = Buffer(template({
	  			glyphs: glyphMap
  		}));

      if(outputFile.isBuffer()) {
        outputFile.contents = content;
      } else {
        outputFile.contents.write(content);
        outputFile.contents.end();
      }

      stream.push(outputFile);
		}

		cb();
  };

  return stream;
};

module.exports = iconfontSCSS;
