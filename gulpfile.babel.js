'use strict';

import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import pug from 'gulp-pug';
import runSeq from 'run-sequence';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';

const PATH = {
  src: {
    pug: './src/pug/**/*.pug',
    scss: './src/scss/**/*.scss',
    scripts: './src/js/**/*.js',
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
  },
  modules: {
    root: './node_modules',
    bulma: './node_modules/bulma',
    chartjs: './node_modules/chart.js/dist/Chart.js',
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
    .pipe(gulp.dest(PATH.build.css))
);

gulp.task('scripts', () => {
  gulp.src([PATH.src.scripts, PATH.modules.chartjs])
    .pipe(concat(PATH.main.scripts))
    .pipe(uglify())
    .pipe(gulp.dest(PATH.build.js));
});

gulp.task('build', (cb) =>
  runSeq('clean', ['scss', 'pug', 'scripts'], cb)
);

gulp.task('default', ['build']);

gulp.task('watch', ['build'], () => {
  gulp.watch([PATH.src.pug], ['pug']);
  gulp.watch([PATH.src.scss], ['scss']);
  gulp.watch([PATH.src.scripts], ['scripts']);
});
