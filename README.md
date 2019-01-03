# gulp-iconfont-css
> Generate (S)CSS file for icon font created with [Gulp](http://gulpjs.com/)

## Warning

Recent versions of [gulp-iconfont](https://github.com/nfroidure/gulp-iconfont) emit a `glyphs` (or `codepoints` < 4.0.0) event (see [docs](https://github.com/nfroidure/gulp-iconfont/)) which should likely be used instead of the workflow described below. However, it will continue to work as expected.

## Usage

First, install `gulp-iconfont` and `gulp-iconfont-css` as development dependencies:

```shell
npm install --save-dev gulp-iconfont gulp-iconfont-css
```

Then, add it to your `gulpfile.js`. **Important**: `gulp-iconfont-css` has to be inserted *before* piping the files through `gulp-iconfont`.

```javascript
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');

var fontName = 'Icons';

gulp.task('iconfont', function(){
  gulp.src(['app/assets/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      path: 'app/assets/css/templates/_icons.scss',
      targetPath: '../../css/_icons.scss',
      fontPath: '../../fonts/icons/'
    }))
    .pipe(iconfont({
      fontName: fontName
     }))
    .pipe(gulp.dest('app/assets/fonts/icons/'));
});
```

`gulp-iconfont-css` works well with `gulp-iconfont` but you can use it in a more modular fashion by directly using `gulp-svgicons2svgfont`, `gulp-svg2tff`, `gulp-ttf2eot`, `gulp-ttf2woff` and/or `gulp-ttf2woff2`.

## API

### iconfontCSS(options)

#### options.fontName
Type: `String`

The name of the generated font family (required). **Important**: Has to be identical to iconfont's `fontName` option.

#### options.path
Type: `String`

The template path (optional, defaults to `css` template provided with plugin). If set to `scss`,  `sass` or `less`, the corresponding default template will be used. See [templates](templates).

#### options.targetPath
Type: `String`

The path where the (S)CSS file should be saved, relative to the path used in `gulp.dest()` (optional, defaults to `_icons.css`). Depennding on the path, it might be necessary to set the `base` option, see https://github.com/backflip/gulp-iconfont-css/issues/16.

#### options.fontPath
Type: `String`

Directory of font files relative to generated (S)CSS file (optional, defaults to ```./```).

#### options.cssClass
Type: `String`

Name of the generated CSS class/placeholder. Used for mixins and functions, too. See https://github.com/backflip/gulp-iconfont-css/tree/master/templates. Default is `icon`.

#### options.engine
Type: `String`

#### options.aliases
Type: `Object`

Use if you want multiple class names for the same font/svg value ie. use the github svg as .github or .git

The template engine to use (optional, defaults to `lodash`). 
See https://github.com/visionmedia/consolidate.js/ for available engines. The engine has to be installed before using.

#### options.cacheBuster
Type: `String`

A string that will be appended to fonts URLs as query string (optional, defaults to the emtpy string, i.e. no cache buster).
Query string heading questing mark `?` is included automatically.
Useful to dodge HTTP cache when deploying a modified iconfont.
