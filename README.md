# gulp-iconfont-css
> Generate (S)CSS file for icon font created with [Gulp](http://gulpjs.com/)

## Usage

First, install `gulp-iconfont-css` as a development dependency:

```shell
npm install --save-dev gulp-iconfont-css
```

Then, add it to your `gulpfile.js`:

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

`gulp-iconfont-css` works well with `gulp-iconfont` but you can use it in a more modular fashion by directly using `gulp-svgicons2svgfont`, `gulp-svg2tff`, `gulp-ttf2eot` and/or `gulp-ttf2woff`.

## API

### iconfontCSS(options)

#### options.fontName
Type: `String`

The name of the generated font family (required). **Important**: Has to be identical to iconfont's ```fontName``` option.

#### options.path
Type: `String`

The template path (optional, defaults to `scss` provided with plugin).

If set to `'scss'`, `'less'`, or `'css'`, default templates using SCSS, Less, or CSS will be generated.

#### options.targetPath
Type: `String`

The path where the (S)CSS file should be saved, relative to the path used in ```gulp.dest()``` (optional, defaults to ```_icons.css```).

#### options.fontPath
Type: `String`

Directory of font files relative to generated (S)CSS file (optional, defaults to ```./```).

#### options.engine
Type: `String`

The template engine to use (optional, defaults to ```lodash```). 
See https://github.com/visionmedia/consolidate.js/ for available engines. The engine has to be installed before using.

