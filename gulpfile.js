var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var argv = require('yargs').argv;
var $ = gulpLoadPlugins();

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var currentPath = 'jd_finance/' //

/**
 * argv
 *  -p --path 改变serve的根目录 默认 .
 *
 */
var baseDir = argv.path || argv.P || currentPath;

baseDir = 'src/' + baseDir

gulp.task('serve:dev', function() {
  browserSync.init({
    notify: false,
    port: 9001,
    open: false,
    server: {
      baseDir: [baseDir],
    }
  })
  gulp.watch([baseDir + '/less/*.less'], ['less'])
  gulp.watch([baseDir + '/*.html']).on('change', reload);
});


gulp.task('less', function() {
  return gulp.src([baseDir + '/{,*}/less/*.less', '!' + baseDir + '/{,*}/less/_*.less'], {
      base: baseDir + '/less'
    })
    .pipe($.plumber({ errorHandler: $.notify.onError('Error: <%= error.message %>') }))
    .pipe($.less())
    .pipe($.autoprefixer({
      browsers: ['last 2 version']
    }))
    .pipe(gulp.dest(baseDir + '/styles/'))
});


gulp.task('build', function() {
  return buildLess(baseDir)
    .pipe(gulp.dest('dist/'))
    .pipe(buildScript(baseDir))
    .pipe($.logger())
    .pipe(gulp.dest('dist/'))
});

gulp.task('buildAll', function() {

});


function buildLess(dir) {
  return gulp.src([dir + '/{,*}/less/*.less', '!' + dir + '/{,*}/less/_*.less'], {
      base: 'src'
    })
    .pipe($.plumber({ errorHandler: $.notify.onError('Error: <%= error.message %>') }))
    .pipe($.less())
    .pipe($.autoprefixer({
      browsers: ['last 2 version']
    }))
}

function buildScript(dir) {
  return gulp.src([dir + '/scripts/{,*/}*.js', '!' + dir + '/scripts/libs/*.js'],{
    base:'src'
  })
    .pipe($.uglify())
}

function copyAssets(){

}
