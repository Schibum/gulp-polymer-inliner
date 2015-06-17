'use strict';
var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var vulcanize = require('gulp-vulcanize');
var inliner = require('./');

function copyTestFile(src, dest) {
	fs.writeFileSync(dest, fs.readFileSync(src, 'utf8'));
}

describe('should inline', function () {
	before(function (cb) {
		rimraf.sync('tmp');
		mkdirp.sync('tmp/dist');

		copyTestFile('fixture/index.html', path.join('tmp', 'index.html'));
		copyTestFile('fixture/import.html', path.join('tmp', 'import.html'));

		var stream = vulcanize();

		stream.on('data', function (file) {
			fs.writeFileSync(path.join('tmp', 'vulcanize.html'), file.contents);
		});

		stream.on('end', cb);

		stream.write(new gutil.File({
			cwd: __dirname,
			base: path.join(__dirname, 'tmp'),
			path: path.join('tmp', 'index.html'),
			contents: fs.readFileSync(path.join('tmp', 'index.html'))
		}));

		stream.end();
	});

	it('simple-usage', function (cb) {
		var stream = inliner();

		stream.on('data', function (file) {
			var ext = path.extname(file.path);
			var contents = file.contents.toString();

			if (/\.html$/.test(file.path)) {
				assert.notInclude(contents, '<script');
				assert.notInclude(contents, '<dom-module');
				assert.notInclude(contents, '<style');
			} else if (/\.js$/.test(file.path)) {
				assert.include(contents, 'Polymer.registerGlobalStyle(\'customStyleContent\');');
				assert.include(contents, 'Polymer.registerInlineDomModule(\'x-import\'');
			} else {
				assert(null);
			}
		});

		stream.on('end', cb);

		stream.write(new gutil.File({
			cwd: __dirname,
			base: path.join(__dirname, 'tmp'),
			path: path.join('tmp', 'vulcanize.html'),
			contents: fs.readFileSync(path.join('tmp', 'vulcanize.html'))
		}));

		stream.end();
	});
});
