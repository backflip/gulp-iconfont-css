# gulp-iconfont-scss [![NPM version](https://badge.fury.io/js/gulp-iconfont.png)](https://npmjs.org/package/gulp-iconfont-scss) [![Build status](https://api.travis-ci.org/backflip/gulp-iconfont-scss.png)](https://travis-ci.org/backflip/gulp-iconfont-scss)
> Create a CSS from fonts with [Gulp](http://gulpjs.com/).

## Usage

First, install `gulp-iconfont-scss` as a development dependency:

```shell
npm install --save-dev gulp-iconfont-scss
```

Then, add it to your `gulpfile.js`:

```javascript
var iconfont = require('gulp-iconfont');
var scss = require('gulp-iconfont-scss');

gulp.task('Iconfont', function(){
  gulp.src(['assets/icons/*.svg'])
    .pipe(scss({
      
    })
    .pipe(iconfont({
      fontName: 'myfont', // required
      appendCodepoints: true // recommanded option
     }))
    .pipe(gulp.dest('www/fonts/'));
});
```

`gulp-iconfont-scss` suits well with `gulp-iconfont` but you can use it in a
 more modular fashion by directly useing `gulp-svgicons2svgfont`,
 `gulp-svg2tff`, `gulp-ttf2eot` and/or `gulp-ttf2woff`.

## API

### scss(options)

#### options.template
Type: `String`

The template path (required).

#### options.ouputfile
Type: `String`

The json path (required).

