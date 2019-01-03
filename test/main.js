var gulp = require('gulp'),
	iconfont = require('gulp-iconfont'),
	fs = require('fs'),
	es = require('event-stream'),
	assert = require('assert'),
	del = require('del'),
	objectAssign = require('object-assign'),
	iconfontCss = require('../');

var fontName = 'Icons',
	resultsDir = __dirname + '/results';

var aliases = {
	github: ['git']
}

function run(type, dest, options) {
	var config = objectAssign({
			fontName: fontName,
			path: type,
			targetPath: '../css/_icons.' + type,
			fontPath: '../fonts/',
			cssClass: 'custom-icon',
			aliases: aliases
		}, options);

	return gulp.src(__dirname + '/fixtures/icons/*.svg')
		.pipe(iconfontCss(config).on('error', function(err) {
			console.log(err);
		}))
		.pipe(iconfont({
			fontName: fontName,
			formats: ['woff2', 'woff', 'svg'],
			timestamp: 1438703262
		}))
		.pipe(gulp.dest(dest + '/fonts/'));
}

function cleanUp(dest, done) {
	del(dest).then(function() {
		done();
	});
}

function testType(type, name) {
	it('should generate ' + name + ' file and fonts', function(done) {
		var dest = resultsDir + '_' + type;

		run(type, dest)
			.pipe(es.wait(function() {
				assert.equal(
					fs.readFileSync(dest + '/css/_icons.' + type, 'utf8'),
					fs.readFileSync(__dirname + '/expected/type/css/_icons.' + type, 'utf8')
				);

				assert.equal(
					fs.readFileSync(dest + '/fonts/Icons.woff2', 'utf8'),
					fs.readFileSync(__dirname + '/expected/type/fonts/Icons.woff2', 'utf8')
				);

				assert.equal(
					fs.readFileSync(dest + '/fonts/Icons.woff', 'utf8'),
					fs.readFileSync(__dirname + '/expected/type/fonts/Icons.woff', 'utf8')
				);

				assert.equal(
					fs.readFileSync(dest + '/fonts/Icons.svg', 'utf8'),
					fs.readFileSync(__dirname + '/expected/type/fonts/Icons.svg', 'utf8')
				);

				cleanUp(dest, done);
			}));
	});
}

function testCodepointFirst() {
	it('glyphs should start with custom code point', function(done) {
		var dest = resultsDir + '_codepoint_first';

		run('css', dest, {
			firstGlyph: 0xE002
		})
			.pipe(es.wait(function() {
				assert.equal(
					fs.readFileSync(dest + '/css/_icons.css', 'utf8'),
					fs.readFileSync(__dirname + '/expected/codepoint_first/css/_icons.css', 'utf8')
				);

				assert.equal(
					fs.readFileSync(dest + '/fonts/Icons.svg', 'utf8'),
					fs.readFileSync(__dirname + '/expected/codepoint_first/fonts/Icons.svg', 'utf8')
				);

				cleanUp(dest, done);
			}));
	});
}

function testCodepointFixed() {
	it('glyphs should start with custom code point', function(done) {
		var dest = resultsDir + '_codepoint_fixed';

		run('css', dest, {
			fixedCodepoints: {
				github: 0xE010,
				twitter: 0xE020
			}
		})
			.pipe(es.wait(function() {
				assert.equal(
					fs.readFileSync(dest + '/css/_icons.css', 'utf8'),
					fs.readFileSync(__dirname + '/expected/codepoint_fixed/css/_icons.css', 'utf8')
				);

				assert.equal(
					fs.readFileSync(dest + '/fonts/Icons.svg', 'utf8'),
					fs.readFileSync(__dirname + '/expected/codepoint_fixed/fonts/Icons.svg', 'utf8')
				);

				cleanUp(dest, done);
			}));
	});
}

function testCacheBuster() {
	it('should use given cache buster as query param', function(done) {
		var dest = resultsDir + '_cache_buster';

		run('css', dest, {
			cacheBuster: 'v0.1.2'
		})
			.pipe(es.wait(function() {
				assert.equal(
					fs.readFileSync(dest + '/css/_icons.css', 'utf8'),
					fs.readFileSync(__dirname + '/expected/cache_buster/css/_icons.css', 'utf8')
				);

				cleanUp(dest, done);
			}));
	});
}


describe('gulp-iconfont-css', function() {
	testType('scss', 'SCSS');
	testType('sass', 'Sass');
	testType('less', 'Less');
	testType('css', 'CSS');

	testCodepointFirst();
	testCodepointFixed();
	testCacheBuster();
});
