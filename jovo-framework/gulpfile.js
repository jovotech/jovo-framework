const gulp = require('gulp');
if (gulp.series === undefined) {
    console.error('\nYou are using an outdated version of gulp.');
    console.error('Please update by running:');
    console.error(' >> npm install gulp@4.0.0 --save-dev');
    process.exit(1);
}


const { src, dest, series } = require('gulp');
const fs = require('fs');
const install = require('gulp-install');
const run = require('gulp-run-command').default;
const zip = require('gulp-zip');
const path = require('path');

const config = {
    projectFolder: './src',
    projectFolderTypeScript: './dist',
    destinationFolder: './bundle'
};



// ------------------------------------------------------
// -                      Generic                       -
// ------------------------------------------------------


function changePackageFile(cb) {
    const packageFilePath = path.join(process.cwd(), config.destinationFolder, 'package.json');
    const tsConfig = require(packageFilePath);
    tsConfig.main = './index.js';

    fs.writeFileSync(packageFilePath, JSON.stringify(tsConfig, null, 2));
    cb()
}



// ------------------------------------------------------
// -                  Regular Project                   -
// ------------------------------------------------------


function prepareProject() {
    return src([
        config.projectFolder + '/**/*',
        'package.json',
    ])
        .pipe(dest(config.destinationFolder))
        .pipe(install({
            npm: '--production',
        }));
}


function build() {
    return src(config.destinationFolder + '/**/*', { nodir: true })
        .pipe(zip('bundle.zip'))
        .pipe(dest('.'));
}


exports.default = series(
    prepareProject,
    changePackageFile,
    build,
);
exports.build = exports.default;



// ------------------------------------------------------
// -                 TypeScript Project                 -
// ------------------------------------------------------


function createTempTsConfig(cb) {
    const tsConfig = require(path.join(process.cwd(), 'tsconfig.json'));
    tsConfig.exclude.push('test/**/*')
    fs.writeFileSync('./.tsconfig-build.json', JSON.stringify(tsConfig, null, 2));
    cb()
}


function prepareProjectTs() {
    return src([
        config.projectFolderTypeScript + '/**/*',
        'package.json',
    ])
        .pipe(dest(config.destinationFolder))
        .pipe(install({
            npm: '--production',
        }));
}


function createTsBundle() {
    return src(config.destinationFolder + '/**/*', { nodir: true })
        .pipe(zip('bundle.zip'))
        .pipe(dest('.'));
}


function compileTs() {
    return run('npm run tsc -- --p .tsconfig-build.json')();
};


function cleanupTempTsConfig(cb) {
    fs.unlinkSync('./.tsconfig-build.json');
    cb()
}


exports['build-ts'] = series(
    createTempTsConfig,
    compileTs,
    prepareProjectTs,
    changePackageFile,
    createTsBundle,
    cleanupTempTsConfig,
);
