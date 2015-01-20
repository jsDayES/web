var gulp = require('gulp');
var jade = require('gulp-jade');
var plumber = require("gulp-plumber");
var sass = require("gulp-ruby-sass");
var scsslint = require("gulp-scss-lint");

var paths = {
  mainJade: 'src/templates/index.jade',
  jade: 'src/templates/**/*.jade',
  mainSass: 'src/styles/main.scss',
  sass: 'src/styles/**/*.scss',
  dist: 'dist/'
};

gulp.task('express', function() {
  var express = require('express');
  var app = express();

  app.use('/js', express.static('dist/js'));
  app.use('/styles', express.static('dist/styles'));
  app.use('/images', express.static('dist/images'));

  app.all( '/', function(req, res, next) {
    res.sendFile('index.html', {root: paths.dist});
  });

  app.listen(9001);
});

gulp.task("sass-lint", function() {
  gulp.src(paths.mainSass)
    .pipe(scsslint({config: "scsslint.yml"}))
});

gulp.task("sass", ["sass-lint"], function() {
  gulp.src(paths.mainSass)
    .pipe(plumber())
    .pipe(sass({
      'sourcemap=none': true
    }))
    .pipe(gulp.dest(paths.dist + 'styles/'));
});

gulp.task('jade', function() {
  gulp.src(paths.mainJade)
    .pipe(plumber())
    .pipe(jade({pretty: false}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function() {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', [
  'sass',
  'jade',
  'express',
  'watch'
])
