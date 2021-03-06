var babel = require('gulp-babel');
var browserify = require('browserify');
var del = require('del');
var flatten = require('gulp-flatten');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');

var babelDefaultOptions = require('./scripts/babel/default-options');

var paths = {
  dist: './dist/',
  flowInclude: 'flow/include',
  lib: 'lib',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
  ],
};

var browserifyConfig = {
  entries: ['./index.js'],
  standalone: 'Flux'
};

gulp.task('clean', function(cb) {
  del([paths.lib, paths.flowInclude, 'Flux.js'], cb);
});

gulp.task('lib', function() {
  return gulp
    .src(paths.src)
    .pipe(babel(babelDefaultOptions))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib));
});

gulp.task('flow', function() {
  return gulp
    .src(paths.src)
    .pipe(flatten())
    .pipe(gulp.dest(paths.flowInclude));
});

gulp.task('browserify', ['lib'], function() {
  return browserify(browserifyConfig)
    .bundle()
    .pipe(source('Flux.js'))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('build', ['lib', 'flow', 'browserify']);

gulp.task('publish', function(cb) {
  runSequence('clean', 'build', cb);
});

gulp.task('default', ['build']);
