/*!
*  默认任务
*/
var config = require('../config.json')
var pkg    = require('../package.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()
var connect = $.connect

var Lib        = require('../lib')
var errHandler = Lib.errHandler
var template   = Lib.template(config.template);

var px2rem = require('gulp-px3rem')


module.exports = function defaultTask(serverRoot) {

  // 模板
  gulp.task('template', function(){
  	return gulp.src([config.template + '/**/**.html', '!'+ config.template + '/**/_**.html', '!'+ config.template +'/_**/*.html'])
          				.pipe(template(config))
                  .pipe($.prettify({indent_size: 2}))
                  .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          				.pipe(gulp.dest(config.destPath))
                  .pipe(connect.reload())
  });

  // less
  gulp.task('less', function(){
      return gulp.src([config.staticPath+'/less/**/**.less', '!'+ config.staticPath +'/_**/**', '!'+ config.staticPath + '/**/_*.less'])
                  .pipe($.sourcemaps.init())
                  .pipe($.less())
                  .pipe($.autoprefixer())
                  // 转换成rem单位
                  .pipe(px2rem())
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

      //console.log('server start at: http://'+ Lib.getIPAdress() +':' + config.port + '/'+ config.destPath)

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
