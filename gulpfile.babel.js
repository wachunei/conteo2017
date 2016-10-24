'use strict';

import babel from 'gulp-babel';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import concat from 'gulp-concat';
import cssnano from 'gulp-cssnano';
import del from 'del';
import gulp from 'gulp';
import pug from 'gulp-pug';
import runSeq from 'run-sequence';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const PATH = {
  src: {
    pug: './src/pug/**/*.pug',
    scss: './src/scss/**/*.scss',
    script: './src/js/main.js',
    scripts: './src/js/**/*.js',
    images: './src/images/**/*.+(png)',
  },
  main: {
    pug: './src/pug/index.pug',
    scss: './src/scss/style.scss',
    scripts: 'main.min.js',
  },
  build: {
    root: './build',
    css: './build/css',
    js: './build/js',
    images: './build/images',
  },
  modules: {
    root: './node_modules',
    bulma: './node_modules/bulma',
  },
};

gulp.task('clean', () => del('./build/*'));

gulp.task('pug', () =>
  gulp.src([PATH.main.pug])
    .pipe(pug())
    .pipe(gulp.dest(PATH.build.root))
);

gulp.task('scss', () =>
  gulp.src([PATH.main.scss])
    .pipe(sass({
      includePaths: [PATH.modules.bulma],
    }).on('error', sass.logError))
    .pipe(cssnano())
    .on('error', function (e) { throw e.stack; })
    .pipe(gulp.dest(PATH.build.css))
);

gulp.task('scripts', () => {
  let bundler = browserify(PATH.src.script);
  bundler.transform(babelify);

  bundler.bundle()
    .on('error', function (err) { console.error(err); })
    .pipe(source(PATH.main.scripts))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(concat(PATH.main.scripts))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATH.build.js));
});

gulp.task('images', () => gulp.src(PATH.src.images)
  .pipe(gulp.dest(PATH.build.images)));

gulp.task('build', (cb) =>
  runSeq('clean', ['scss', 'pug', 'scripts', 'images'], cb)
);

gulp.task('default', ['build']);

gulp.task('watch', ['build'], () => {
  gulp.watch([PATH.src.pug], ['pug']);
  gulp.watch([PATH.src.scss], ['scss']);
  gulp.watch([PATH.src.images], ['images']);
  gulp.watch([PATH.src.scripts], ['scripts']);
});
