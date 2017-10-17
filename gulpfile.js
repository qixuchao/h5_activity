var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var argv = require('yargs').argv;
var $ = gulpLoadPlugins();

var browserSync = require('browser-sync');
var reload      = browserSync.reload;

/**
 * argv
 *  -p --path 改变serve的根目录 默认 .
 *  
 */
var baseDir = argv.path || argv.P || '.';

gulp.task('serve:dev', function() {
    browserSync.init({
        notify: false,
        port: 9001,
        open: false,
        server: {
            baseDir: [ baseDir ],
        }
    })
    gulp.watch([baseDir+'/less/*.less'],['less'])
    gulp.watch([baseDir+'/*.html']).on('change', reload);
});


gulp.task('less',function(){
	return gulp.src([baseDir+'/{,*}/less/*.less','!'+baseDir+'/{,*}/less/_*.less'],{
            base:baseDir+'/less'
        })
        .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
        .pipe($.less())
        .pipe(gulp.dest(baseDir+'/styles/'))
        .pipe(reload({stream: true}))
})


gulp.task('build',function(){})