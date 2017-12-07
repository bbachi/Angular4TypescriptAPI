var gulp  = require('gulp'),
    gutil = require('gulp-util');
    clean = require('gulp-clean');
    zip = require('gulp-zip');


    gulp.task('default', ['zip'], function() {
      return gutil.log('Gulp is running!')
    });

    gulp.task('copyreactbundle', ['clean'], function() {
      // copy any html files in source/ to public/
        gulp.src('app/dist/*').pipe(gulp.dest('dist/app/dist'));
    });

    gulp.task('clean', function () {
      return gulp.src('bundle/*', { read: false }).pipe(clean());
      });

      gulp.task('zip', ['copyreactbundle'], () =>
          gulp.src(['dist/**/**'])
              .pipe(zip('bundle.zip'))
              .pipe(gulp.dest('bundle'))
);
