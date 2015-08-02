var gulp = require('gulp'),
	iconfont = require('gulp-iconfont'),
	fs = require('fs'),
	es = require('event-stream'),
	assert = require('assert'),
	iconfontCss = require('../');

describe('gulp-iconfont-css', function() {
	var fontName = 'Icons';

	function testType(type, name) {
		var resultsDir = __dirname + '/results_' + type;

		it('should generate ' + name + ' file', function(done) {
			gulp.src(__dirname + '/fixtures/icons/*.svg')
				.pipe(iconfontCss({
					fontName: fontName,
					path: type,
					targetPath: '../css/_icons.' + type,
					fontPath: '../fonts/'
				}).on('error', function(err) {
					console.log(err);
				}))
				.pipe(iconfont({
					fontName: fontName,
					formats: ['ttf', 'eot', 'woff', 'svg']
				}))
				.pipe(gulp.dest(resultsDir + '/fonts/'))
				.pipe(es.wait(function() {
					assert.equal(
						fs.readFileSync(resultsDir + '/css/_icons.' + type, 'utf8'),
						fs.readFileSync(__dirname + '/expected/_icons.' + type, 'utf8')
					);

					fs.unlinkSync(resultsDir + '/css/_icons.' + type);
					fs.rmdirSync(resultsDir + '/css/');
					fs.unlinkSync(resultsDir + '/fonts/' + fontName + '.ttf');
					fs.unlinkSync(resultsDir + '/fonts/' + fontName + '.eot');
					fs.unlinkSync(resultsDir + '/fonts/' + fontName + '.woff');
					fs.unlinkSync(resultsDir + '/fonts/' + fontName + '.svg');
					fs.rmdirSync(resultsDir + '/fonts/');
					fs.rmdirSync(resultsDir);

					done();
				}));
		});
	}

	testType('scss', 'SCSS');
	testType('less', 'Less');
	testType('css', 'CSS');
});