/**
 * 生成环境，更新到SVN
 *
 */
var config = require('../config.json')
var pkg    = require('../package.json')
var svn    = require('../svn.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()
var connect = $.connect

var Lib    = require('../lib')

var rename = require('gulp-regex-rename')

var del = require('del')

module.exports = function svnTask(banner) {
  // 临时文件夹
  var tmpPath = path.join(__dirname, '../tmp')
  var rootPath = path.join(__dirname, '../')
  var staticPath = path.join(tmpPath, svn.staticPath)

  // 模板
  gulp.task('svnTemplate', ['template'], function(){
      return gulp.src(['./'+ config.destPath + '/**/**.html'])
              //.pipe($.changed(svn.path))
              .pipe($.replace(/\/static/g, './static'))
              .pipe($.replace(/"(\/)bower_components\/(.*)\/([a-zA-Z0-9.]+\.js)(.*)"/g, '"'+ config.staticPath +'/js/$3$4"'))
              .pipe($.replace(/\.debug\.css/g, '.css'))
              .pipe($.prettify({indent_size: 2}))
              .pipe(gulp.dest(tmpPath))
  });

  // 构建js
  gulp.task('buildJS', ['svnTemplate'], function(){
      return gulp.src([tmpPath + '/**/**.html'])
                //.pipe($.replace(/^\/static/g, 'static'))
                .pipe($.usemin({
                    //assetsDir: __dirname,
                    outputRelativePath: tmpPath,
                    path: rootPath,
                    //js: [function() { return $.uglify({mangle: false})}]
                    js: [$.uglify]
                }))
                .pipe(gulp.dest(tmpPath));
  });

  // 拷贝
  gulp.task('svnCopy', function(){
      return gulp.src([config.staticPath + '/iconfont/**/**', config.staticPath + '/iconfont-ie7/**/**'], {base: 'client'})
          .pipe($.changed(svn.staticPath))
          .pipe(gulp.dest(staticPath))
  })

  // css
  gulp.task('renameCss', function() {
    return gulp.src([config.staticPath+'/css/**/**.debug.css'])
                .pipe(rename(/\.debug\.css/, '.css'))
                .pipe(gulp.dest(staticPath+'/css'))
  });
  gulp.task('svnCss', ['renameCss'], function(){
      return gulp.src([config.staticPath+'/css/**/**.css', '!'+config.staticPath+'/css/**/**.debug.css'], {base: 'client'})
          .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          .pipe($.changed(svn.staticPath))
          .pipe($.cleanCss({compatibility: 'ie7'}))
          .pipe($.minifyCss({keepSpecialComments: 0, compatibility: 'ie7'}))
          .pipe($.header(banner, { pkg: pkg}))
          .pipe(gulp.dest(staticPath))
  })

  // js
  gulp.task('svnJs', ['buildJS', 'svnBowerJs'], function(){
      return gulp.src([config.staticPath+'/js/app/**/**.js'], {base: 'client'})
          .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          .pipe($.changed(svn.staticPath))
          .pipe($.uglify({mangle: false}))
          .pipe($.header(banner, { pkg: pkg}))
          .pipe(gulp.dest(staticPath))
  })

  gulp.task('svnBowerJs', function(){
      return gulp.src(config.jsPath)
              .pipe($.changed(svn.staticPath))
              .pipe(gulp.dest(staticPath+'/js'))
  })

  // images
  gulp.task('svnImage', function(){
      return gulp.src([config.staticPath+'/images/**/**', '!'+config.staticPath+'/images/sprite/sprite-**/', '!'+config.staticPath+'/images/sprite/sprite-**/**/**'])
          .pipe($.plumber( { errorHandler: Lib.errrHandler } ))
          //.pipe($.changed(svn.staticPath))
          // 启用压缩要先安装gulp-imagemin，时间比较长
          // npm install gulp-imagemin --save
          //.pipe($.imagemin({
          //            optimizationLevel: 5,
          //            progressive: true,
          //            svgoPlugins: [{removeViewBox: false}]//,
          //            //use: [pngquant()]
          //        })
          //)
          .pipe(gulp.dest(staticPath+'/images'))
  })

  gulp.task('svnDoc', function() {
    return gulp.src([config.docs.destPath+'/**/**', '!'+config.docs.destPath+'/template/**'])
                .pipe(gulp.dest(staticPath+'/docs'))
  });

  gulp.task('build', ['svnCopy', 'svnCss', 'svnJs', 'svnImage', 'svnDoc'], function() {
    return gulp.src(tmpPath+'/**/**')
              .pipe(gulp.dest(svn.path))
  })

  gulp.task('svnServer', ['build'], function(cb){
      connect.server({
          root: svn.path,
          port: svn.port
      });

      //console.log('server start at: http://'+ Lib.getIPAdress() +':' + svn.port + '/')

      Lib.openUrl('http://'+ Lib.getIPAdress() +':' + svn.port + '/')

      // 删除临时文件夹
      del([tmpPath, tmpPath+'/**/**'], cb);
  })

  gulp.task('svn', function(){
      gulp.start(['svnServer']);
  });
}
