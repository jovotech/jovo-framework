const gulp = require('gulp');
const install = require('gulp-install');
const zip = require('gulp-zip');


const config = {
    projectFolder: './src',
    destinationFolder: './dist'
};

gulp.task('prepareProject', function () {
    return gulp.src([
        config.projectFolder + '/**/*',
        'package.json',
    ])
        .pipe(gulp.dest(config.destinationFolder))
        .pipe(install({
            npm: '--production',
        }))
});


gulp.task('build', ['prepareProject'], function () {
    return gulp.src(config.destinationFolder + '/**/*')
        .pipe(zip('bundle.zip'))
        .pipe(gulp.dest('.'))
});


gulp.task('default', ['build']);

