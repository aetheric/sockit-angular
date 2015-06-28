/* global require */

var gulp = require('gulp');

gulp.task('build', require('./src/gulp/build'));
gulp.task('test', [ 'build' ], require('./src/gulp/test'));
