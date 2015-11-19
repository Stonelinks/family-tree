'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

var path = {
    index: './*.html',
    style: './style/**/*.scss',
    data: './data/**/*',
    images: './images/**/*',
    js: './js/**/*.js'
};

gulp.task('js', function() {
    var bundler = browserify({
        entries: ['./js/main.js'],
        //debug: true
    });

    //bundler.require('./js/main.js', {
    //    expose: 'create3dViewer'
    //});
    //// needed for tests to work
    //bundler.require('backbone.marionette');
    //bundler.require('jquery');

    var bundle = function() {
        return bundler
            .bundle()
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('../maps'))
            .pipe(gulp.dest('./build/js/'));
    };
    return bundle();
});

gulp.task('style', function () {
    return gulp.src(path.style)
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true}))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./build/style'));
});

gulp.task('webserver', function() {
    return gulp.src('./build')
        .pipe(webserver({
            host: '0.0.0.0',
            port: 8999,
            livereload: true,
            open: true
        }));
});

gulp.task('index', function() {
    return gulp.src(path.index)
        .pipe(gulp.dest('./build/'));
});

gulp.task('data', function() {
    return gulp.src(path.data)
        .pipe(gulp.dest('./build/data'));
});

gulp.task('images', function() {
    return gulp.src(path.images)
        .pipe(gulp.dest('./build/images'));
});

gulp.task('build', ['js', 'style', 'index', 'data', 'images']);

gulp.task('watch', ['build'], function() {
    gulp.watch(path.js, ['js']);
    gulp.watch(path.style, ['style']);
    gulp.watch(path.index, ['index']);
    gulp.watch(path.data, ['data']);
    gulp.watch(path.images, ['images']);
});

gulp.task('develop', ['watch', 'webserver']);

gulp.task('default', ['build']);