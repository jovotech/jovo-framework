const fs = require('fs');
const gulp = require('gulp');
const install = require('gulp-install');
const run = require('gulp-run-command').default;
const zip = require('gulp-zip');
const tsConfig = require('./tsconfig.json');

const config = {
    projectFolder: './src',
    projectFolderTypeScript: './dist',
    destinationFolder: './bundle'
};


// ------------------------------------------------------
// -                  Regular Project                   -
// ------------------------------------------------------


gulp.task('prepare-project', function () {
    return gulp.src([
        config.projectFolder + '/**/*',
        'package.json',
    ])
        .pipe(gulp.dest(config.destinationFolder))
        .pipe(install({
            npm: '--production',
        }));
});

gulp.task('build', ['prepare-project'], function () {
    return gulp.src(config.destinationFolder + '/**/*')
        .pipe(zip('bundle.zip'))
        .pipe(gulp.dest('.'));
});


gulp.task('default', ['build']);


// ------------------------------------------------------
// -                 TypeScript Project                 -
// ------------------------------------------------------

gulp.task('create-temp-tsconfig', function (done) {
    tsConfig.exclude.push('test/**/*')
    fs.writeFileSync('./.tsconfig-build.json', JSON.stringify(tsConfig, null, 2));
    done();
});

gulp.task('compile-ts', ['create-temp-tsconfig'], run('npm run tsc -- --p .tsconfig-build.json'));

gulp.task('prepare-project-ts', ['compile-ts'], function () {
    return gulp.src([
        config.projectFolderTypeScript + '/**/*',
        'package.json',
    ])
        .pipe(gulp.dest(config.destinationFolder))
        .pipe(install({
            npm: '--production',
        }));
});

gulp.task('create-ts-bundle', ['prepare-project-ts'], function () {
    return gulp.src(config.destinationFolder + '/**/*')
        .pipe(zip('bundle.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('build-ts', ['create-ts-bundle'], function (done) {
    fs.unlinkSync('./.tsconfig-build.json');
    done();
});
