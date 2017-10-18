var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var gulpif = require('gulp-if');
var $ = gulpLoadPlugins();

// var fs = require('fs');
// var ejs = require('ejs');
// var path = {
//     src: './src/',
//     dev: './src/',
//     build: './dist/',
//     tmp: './.tmp/',
// };

// var host = {
//     root: [path.src, '.tmp'],
//     port: 8888
// };

// var browser = 'Google chrome';
// var gulpOpen = require('gulp-open');
/**
 * @Style
 * sassToCss    将sass文件转译成css文件
 * */
gulp.task('sassToCss', function () {
    return gulp.src('./sass/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('./css'))
});
/**
 *@搭建服务器
 * 页面自动刷新
 */
// gulp.tadk('',function(){
	
// })
/**
 * @buildCompile    编译成生产环境的文件
 * 插件说明：
 * gulp-ejs 编译ejs成html
 * gulp-rename  系统文件文字
 * gulp-logger  打印日志
 * gulp-useref gulp-if  更换文件路径
 * */
// gulp.task('buildCompile', ['sassToCss'], function () {
//     return gulp.src(path.src + 'ejs/page/**/*.ejs')
//         .pipe($.ejs({}))
//         .pipe($.rename({
//             extname: '.html'
//         }))
//         .pipe($.useref({
//             searchPath: ['src', '.tmp']
//         }))
//         .pipe(gulpif('*.js', $.uglify({
//             mangle: {except: ['require', 'exports', 'module', '$']}
//         }))) //压缩js
//         .pipe(gulpif('*.css', $.minifyCss())) //压缩css
//         .pipe($.logger())
//         .pipe(gulpif('*.css', $.autoprefixer('last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))) //css兼容浏览器
//         .pipe(gulp.dest(path.build + 'html/'));
// });

// /**
//  * 静态文件服务器
//  * connect  搭建静态服务器
//  * reload   网页自动刷新
//  * */
// gulp.task('connect', function () {
//     $.connect.server({
//         root: host.root,
//         port: host.port,
//         livereload: true,
//         middleware: function (connect, opts) {
//             return [templateCompile];
//         }
//     });
// });

// //打开浏览器
// gulp.task('open', function (done) {
//     gulp.src('')
//         .pipe(gulpOpen({
//             app: browser,
//             uri: 'http://localhost:' + host.port
//         }))
// });

/**
 * 清空文件夹
 * */
// gulp.task('clean', function () {
//     return gulp.src([path.build, path.dev + 'css'])
//         .pipe($.clean())
// });

/**
 * 复制任务
 * */
// gulp.task('copy', function () {
//     gulp.src(path.src + 'js/{plugins,libs}/{,**/}*')
//         .pipe(gulp.dest(path.build + 'js/'));
//     gulp.src([path.src + 'font/*'])
//         .pipe(gulp.dest(path.build + 'font'));
//     gulp.src([path.src + 'data/*'])
//         .pipe(gulp.dest(path.build + 'data'));
//     gulp.src(path.src + 'img/{**,*}/*')
//         .pipe(gulp.dest(path.build + 'img'));
// });
/**
 * 开发监听
 * */
gulp.task('watch', function () {
    gulp.watch('./sass/*.scss', ['sassToCss']);
    // $.livereload.listen();
    // gulp.watch(path.dev).on('change', $.livereload.changed);
});

// /**
//  * 打包给后台
//  * toBuild  生成生产环境下的文件
//  * */
// gulp.task('build', ['clean'], function () {
//     gulp.run(['sassToCss', 'copy', 'buildCompile', 'bootstrap']);
// });

/**
 * 开发环境
 * atDevelopment   在开发环境下的配置
 * */
gulp.task('atDevelopment', function () {
    gulp.run(['sassToCss', 'watch']);
});

// gulp.task('config', function () {
//     return gulp.src(['./src/js/{,**/}*.js', '!./src/js/sea.config.js'])
//         .pipe($.rev())
//         .pipe($.uglify({
//             mangle: {except: ['require' ,'exports' ,'module' ,'$']}
//         }))
//         .pipe(gulp.dest('./dist/js'))
//         .pipe($.rev.manifest())
//         .pipe($.seajsConfigMap({
//             base: 'src',
//             configFile: 'js/sea.config.js'
//         }))
//         .pipe(gulp.dest('./dist/js'));
// });

// gulp.task('bootstrap', ['replace'], function () {
//     return gulp.src([
//         './src/js/libs/seajs/sea-2.2.3/sea.js',
//         // './src/js/module/seajs/seajs-ls-cache.js',
//         './dist/js/sea.config.js',
//     ])
//         .pipe($.uglify())
//         .pipe($.concat('main.js'))
//         .pipe(gulp.dest('./dist/js'));
// });

// gulp.task('replace', ['config'], function () {
//     return gulp.src(['./dist/js/sea.config.js'])
//         .pipe($.replace(' base: "/js"', 'base: window.VANEE_HOST+"/js"'))
//         .pipe(gulp.dest('./dist/js'));
// });
// //connect middleware 将动态模版转换成html
// //@TODO 可以将ejs的编译和路径做为connect的参数
// //传入更加灵活
// function templateCompile(req, res, next) {
//     var path = req.url.match(/(\S*).html/);
//     if (path && path[1]) {
//         //根据路径获取实际的文件路径
//         var html = fs.readFileSync('src/ejs' + path[1] + '.ejs', 'utf8');
//         res.end(ejs.render(html, {
//             filename: 'src/ejs/' + path[1] + '.ejs'
//         }))
//     } else {
//         next();
//     }
// }