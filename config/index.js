const path = require('path')
const projectPath = 'activityName/'

function resolveDev(dir) {
  return path.join(__dirname, '../src/' + projectPath, dir)
}

function resolveBuild(dir) {
  return path.join(__dirname, '../dist/' + projectPath, dir)
}

const config = {
  dev: {
    html: [resolveDev('/**/*.html'), '!./src/html/include/**/*', '.tmp/rev-manifest.json'],
    styles: [resolveDev('/{less,styles}/**/*.{less,css}'), '!' + resolveDev('/{less,styles}/**/_*.{less,css}') , '.tmp/rev-manifest.json'],
    script: [resolveDev('/js/**/*.js'), resolveDev('../../helper/*.js')],
    images: resolveDev('/images/**/*.{png,jpg,gif,svg}'),
    lib: resolveDev('/lib/**/*.js'),
  },

  build: {
    html: resolveBuild(''),
    styles: resolveBuild('/styles'),
    script: resolveBuild('/js'),
    images: resolveBuild('/images'),
    lib: resolveBuild('/lib'),
  },

  zip: {
    name: 'gulpProject.zip',
    path: resolveBuild('**/*'),
    dest: path.join(__dirname, '../')
  },
  projectPath,
  useEslint: false,
  useWebpack: false,
  productionZip: false,
  server: {
    // 服务器
    server: ['.tmp','src/'+projectPath],
    // 是否开启多端同步
    ghostMode: {
      click: false, // 同步点击
      scroll: false // 同步滚动
    },
    // 再控制台打印前缀
    // logPrefix: 'browserSync in gulp',
    // 运行后自动打开的；浏览器 （不填默认则是系统设置的默认浏览器）
    browser: ['chrome'],
    // 自动打开浏览器
    open: false,
    // 使用端口`
    port: '8080'
  }
}

//console.log(config)

module.exports = config
