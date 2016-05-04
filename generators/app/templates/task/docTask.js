/**
 * 生成开发文档
 *
 */
var config = require('../config.json')
var pkg    = require('../package.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()

var connect = $.connect

var Lib    = require('../lib');
var srcUrl = path.join(__dirname, '..', config.docs.srcPath);
var destUrl = path.join(__dirname, '..', config.docs.destPath);
var templateUrl = path.join(srcUrl, config.docs.template)
var marked = Lib.marked(templateUrl, srcUrl);
//var marked = require('gulp-marked')



module.exports = function docTask() {
  gulp.task('docsTemplate', function() {
    //if(!config || !config.docs) return null;
    return gulp.src(srcUrl+'/**/**.md')
            .pipe(marked())
            .pipe($.rename({
              extname: '.html'
            }))
            .pipe($.prettify({indent_size: 2}))
            .pipe(gulp.dest(destUrl))
            .pipe(connect.reload());
  });

  gulp.task('docsStatic', function() {
    return gulp.src([srcUrl+'/**/**', '!'+srcUrl+'/**/**.md'])
                .pipe(gulp.dest(destUrl))
  })

  gulp.task('docsWatch', function(){
    return gulp.watch(srcUrl+'/**/**.md', ['docsTemplate'])
  })

  // 启动服务
  gulp.task('docsServer', function(){
    connect.server({
      root: destUrl,
      port: config.docs.port,
      livereload: true
    });

   // console.log('server start at: http://'+ Lib.getIPAdress() +':'+ config.docs.port +'/')

    Lib.openUrl('http://'+ Lib.getIPAdress() +':'+ config.docs.port +'/')
  })

  gulp.task('docs', ['docsTemplate', 'docsStatic', 'docsWatch', 'docsServer'])
}
