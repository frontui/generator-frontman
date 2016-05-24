/*!
*  默认任务
*  1. 模板编译 nunjucks
*  2. less 编译
*  3. livereload 自动刷新
*  4. connect http服务
*/
var gulp = require('gulp');
var config = require('../config.json')
var pkg    = require('../package.json')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()
var connect = $.connect

var Lib        = require('../lib')
var errHandler = Lib.errHandler
var template   = Lib.template(config.template)

var del = require('del')


module.exports = function defaultTask(serverRoot) {

  // 清除旧模板
  gulp.task('template:clean', function(cb) {
      del([config.destPath], cb)
  })

  // 模板
  gulp.task('template', ['template:clean'], function(){
  	return gulp.src([config.template + '/**/**.html', '!'+ config.template + '/**/_**.html', '!'+ config.template +'/_**/*.html'])
          				.pipe(template(config))
                  .pipe($.prettify({indent_size: 2}))
                  .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          				.pipe(gulp.dest(config.destPath))
                  .pipe(connect.reload())
  });

  // less
  // autoprefix
  //    browsers:
  //      'last 2 versions',
  //      'ie6-8',
  //      'iOS 7',
  //      'not ie <= 8'
  //      etc...
  gulp.task('less', function(){
      return gulp.src([config.staticPath+'/less/**/**.less', '!'+ config.staticPath +'/_**/**', '!'+ config.staticPath + '/**/_*.less'])
                  .pipe($.sourcemaps.init())
                  .pipe($.less())
                  .pipe($.autoprefixer('last 2 version', 'not ie <= 8'))
                  .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
                  .pipe($.sourcemaps.write(config.staticPath+'/css'))
                  .pipe(gulp.dest(config.staticPath+'/css'))
                  .pipe(connect.reload())
  })

  // 启动服务
  gulp.task('server', function(){
      connect.server({
          root: serverRoot,
          port: config.port,
          livereload: true
      });

      //console.log('server start at: http://localhost:' + config.port + '/'+ config.destPath)

      Lib.openUrl('http://'+ Lib.getIPAdress() +':' + config.port + '/' + config.destPath)
  })

  //-- 文件监听

  gulp.task('watch', function(){
      gulp.watch(config.template + '/**/**.html', ['template'])
      gulp.watch(config.staticPath + '/less/**/**', ['less'])
      gulp.watch(config.staticPath + '/images/sprite/sprite-*/**/**', ['sprite'])
  })




  /**
   * 默认任务
   * template, less, watch
   */
  gulp.task('default', function(){
      gulp.start(['template', 'less', 'server', 'watch'])
  })
}
