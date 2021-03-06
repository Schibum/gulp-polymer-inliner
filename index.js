'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var inliner = require('polymer-inliner');

function splitFile(file, filename, contents) {
  return new gutil.File({
    cwd: file.cwd,
    base: file.base,
    path: path.join(file.base, filename),
    contents: new Buffer(contents)
  });
}

function getFilename(filepath) {
  var basename = path.basename(filepath, path.extname(filepath));
  return {
    html: basename + '.html',
    js: basename + '.js'
  };
}

module.exports = function(options) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
    	cb(null, file);
    	return;
    }

    if (file.isStream()) {
    	cb(new gutil.PluginError('gulp-polymer-inliner', 'Streaming not supported'));
    	return;
    }

    var splitfile = getFilename(file.path)
    var split = inliner.split(file.contents.toString(), options);
    var stream = this;

    Object.keys(split).forEach(function(type) {
      if (split[type]) {
        stream.push(splitFile(file, splitfile[type], split[type]));
      }
    });

    cb();
  });
};
