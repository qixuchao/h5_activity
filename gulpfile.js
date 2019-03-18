const config = require('./config')

const path = require('path')
const chalk = require('chalk')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')();

const del = require('del')
const pngquant = require('imagemin-pngquant')

// server
const browserSync = require('browser-sync').create()
const reload = browserSync.reload

// NODE_ENV
const env = process.env.NODE_ENV || 'development'

const condition = env === 'production'

function respath(dir) {
  return path.join(__dirname, './', dir)
}

function onError(error) {
  const title = error.plugin + ' ' + error.name
  const msg = error.message
  const errContent = msg.replace(/\n/g, '\\A ')

  $.notify.onError({
    title: title,
    message: errContent,
    sound: true
  })(error)

  // this.emit('end')
}

function cbTask(task) {
  return new Promise((resolve, reject) => {
    del(respath('dist'))
      .then(paths => {
        console.log(chalk.green(`
      -----------------------------
        Clean tasks are completed
      -----------------------------`))
        $.sequence(task, () => {
          console.log(chalk.green(`
        -----------------------------
          All tasks are completed
        -----------------------------`))
          resolve('completed')
        })
      })
  })
}

gulp.task('html', () => {
  return gulp.src(config.dev.html)
    .pipe($.if(condition, $.revCollector({
      replaceReved: true,
      dirReplacements: {
        './styles': './styles',
        './js': './js',
        'images': 'images'
      }
    })))
    .pipe($.plumber(onError))
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: respath('src/include/')
    }))
    .pipe($.if(condition, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    })))
    .pipe(gulp.dest(config.build.html))
})

gulp.task('styles', () => {
  return gulp.src(config.dev.styles)
    .pipe($.revCollector({
      replaceReved: true
    }))
    .pipe($.plumber(onError))
    .pipe($.less())
    .pipe($.if(condition, $.cleanCss({debug: true})))
    //.pipe($.postcss('./.postcssrc.js'))
    .pipe($.rename({dirname: ''}))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.if(condition, $.rev()))
    .pipe($.if(condition, gulp.dest(config.build.styles)))
    .pipe($.if(condition, $.rev.manifest('.tmp/rev-manifest.json', {
      base: '.tmp',
      merge: true // Merge with the existing manifest if one exists
    })))
    .pipe($.if(condition, gulp.dest('.tmp')))
})

gulp.task('images', () => {
  return gulp.src(config.dev.images)
    .pipe($.plumber(onError))
    .pipe($.cache($.imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [ {removeViewBox: false} ], // 不移除svg的viewbox属性
      use: [ pngquant() ] // 使用pngquant插件进行深度压缩
    })))
    .pipe(gulp.dest('.tmp/images'))
    .pipe($.if(condition, $.rev()))
    .pipe($.if(condition, gulp.dest(config.build.images)))
    .pipe($.if(condition, $.rev.manifest('.tmp/rev-manifest.json', {
      base: '.tmp',
      merge: true
    })))
    .pipe($.if(condition, gulp.dest('.tmp')))
})

gulp.task('eslint', () => {
  return gulp.src(config.dev.script)
    .pipe($.plumber(onError))
    .pipe($.if(condition, $.stripDebug()))
    .pipe($.eslint({configFle: './.eslintrc'}))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
})


const useEslint = config.useEslint ? [ 'eslint' ] : [];
gulp.task('script', useEslint, () => {
  return gulp.src(config.dev.script)
    .pipe($.replace('__ENV__', env))
    .pipe($.plumber(onError))
    // .pipe($.logger())
    .pipe($.if(condition, $.uglify()))
    .pipe(gulp.dest('.tmp/js'))
    .pipe($.if(condition, $.rev()))
    .pipe($.if(condition, gulp.dest(config.build.script)))
    .pipe($.if(condition, $.rev.manifest('.tmp/rev-manifest.json', {
      base: '.tmp',
      merge: true
    })))
    .pipe($.if(condition, gulp.dest('.tmp')))
})

// 注意： lib文件下不执行压缩
gulp.task('lib', useEslint, () => {
  return gulp.src(config.dev.lib)
    .pipe(gulp.dest(config.build.lib))
})

gulp.task('less', function () {
  return gulp.src(config.dev.less)
    .pipe($.less())
    .pipe(gulp.dest(config.build.less))
});


gulp.task('clean', () => {
  return del([ 'dist', '.temp' ]).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
})

gulp.task('watch', () => {
  gulp.watch(config.dev.html, [ 'html' ]).on('change', reload)
  gulp.watch(config.dev.styles, [ 'styles' ]).on('change', reload)
  //gulp.watch(config.dev.script, ['script']).on('change', reload)
  gulp.watch(config.dev.images, [ 'images' ]).on('change', reload)
})

gulp.task('zip', () => {
  return gulp.src(config.zip.path)
    .pipe($.plumber(onError))
    .pipe(zip(config.zip.name))
    .pipe(gulp.dest(config.zip.dest))
})

gulp.task('server', () => {
  $.sequence('clean', [ 'styles' ], [ 'script' ], 'lib', 'html')(function () {
    browserSync.init(config.server)
    console.log(chalk.cyan('  Server complete.\n'))
    gulp.start('watch')
  })
})

gulp.task('build', $.sequence('clean', [ 'styles' ], [ 'script' ], 'lib', 'html'))

gulp.task('default', () => {
  console.log(chalk.green(
    `
  Build Setup
    开发环境： npm run dev
    生产环境： npm run build
    执行压缩： gulp zip
    编译页面： gulp html
    编译脚本： gulp script
    编译样式： gulp styles
    语法检测： gulp eslint
    压缩图片： gulp images
    `
  ))
})
