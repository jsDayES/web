var gulp = require('gulp');
var jade = require('gulp-jade');
var plumber = require("gulp-plumber");
var sass = require("gulp-ruby-sass");
var scsslint = require("gulp-scss-lint");
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');

var paths = {
  mainJade: 'src/templates/index.jade',
  jade: 'src/templates/**/*.jade',
  mainSass: 'src/styles/main.scss',
  sass: 'src/styles/**/*.scss',
  js: 'src/js/**/*.js',
  images: 'src/images/**/*',
  dist: 'dist/'
};

var localsJade = {
  callforpapers: 'https://docs.google.com/forms/d/10VztOmnh5KxzWnV4OFU2_6uicIDuh5XB-9WUJYqLjCw/viewform',
  contact: 'hola@jsday.es',
  twitter: 'https://twitter.com/JSDayES',
  youtube: 'https://www.youtube.com/c/JsdayEsMadrid',
  tickets: ' https://www.ticketea.com/jsdayes/'
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

gulp.task('copy-images', function() {
  gulp.src(paths.images)
    .pipe(imagemin({progressive: true}))
    .pipe(gulp.dest(paths.dist + '/images/'));
});

gulp.task('js', function() {
  gulp.src(paths.js)
    .pipe(gulp.dest(paths.dist + '/js/'));
});

gulp.task('sass-lint', function() {
  gulp.src([paths.sass, '!src/styles/reset.scss'])
    .pipe(scsslint({config: 'scsslint.yml'}))
});

gulp.task('sass', ['sass-lint'], function() {
  gulp.src(paths.mainSass)
    .pipe(plumber())
    .pipe(sass({
      'sourcemap=none': true
    }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist + 'styles/'));
});

gulp.task('jade', function() {
  gulp.src(paths.mainJade)
    .pipe(plumber())
    .pipe(jade({pretty: true, locals: localsJade}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function() {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.images, ['copy-images']);
});

gulp.task('default', [
  'copy-images',
  'sass',
  'jade',
  'js',
  'express',
  'watch'
])
