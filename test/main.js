var gulp = require('gulp'),
	fs = require('fs'),
	es = require('event-stream'),
	assert = require('assert'),
	iconfontCss = require('../');

describe('gulp-iconfont-css', function() {
	it('should generate SCSS file', function(done) {
		gulp.src(__dirname + '/fixtures/icons/*.svg')
			.pipe(iconfontCss({
				fontName: 'Icons',
				path: __dirname + '/fixtures/_icons.scss',
				targetPath: '../_icons.scss'
			}))
			.pipe(gulp.dest(__dirname + '/results/icons/'))
			.pipe(es.wait(function() {
				assert.equal(
					fs.readFileSync(__dirname + '/results/_icons.scss', 'utf8'),
					fs.readFileSync(__dirname + '/expected/_icons.scss', 'utf8')
				);

				fs.unlinkSync(__dirname + '/results/_icons.scss');
				fs.unlinkSync(__dirname + '/results/icons/uE001-github.svg');
				fs.unlinkSync(__dirname + '/results/icons/uE002-twitter.svg');
				fs.rmdirSync(__dirname + '/results/icons/');
				fs.rmdirSync(__dirname + '/results/');

				done();
			}));
	});
});
