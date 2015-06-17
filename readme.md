# gulp-polymer-inliner

> Gulp plugin for [Polymer-inliner](https://github.com/Schibum/polymer-inliner) 


## Install

```
$ npm install --save-dev schibum/gulp-polymer-inliner
```


## Usage

```js
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var inliner = require('gulp-polymer-inliner');

gulp.task('default', function () {
	return gulp.src('src/index.html')
		.pipe(vulcanize({
			abspath: '',
			excludes: [],
			stripExcludes: false,
			inlineScripts: false
		}))
		.pipe(inliner());
		.pipe(gulp.dest('dest'));
});
```

## License

MIT © [Jimmy Moon](http://ragingwind.me)
