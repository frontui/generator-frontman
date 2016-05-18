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
var del    = require('del')

module.exports = function svnTask(banner) {
  // 临时文件夹
  var tmpPath = './tmp';

  // 模板
  gulp.task('svnTemplate', ['template'], function(){
      return gulp.src(['./'+ config.destPath + '/**/**.html'])
              .pipe($.prettify({indent_size: 2}))
              //.pipe($.changed(svn.path))
              .pipe($.replace(/\/static/g, './static'))
              .pipe($.replace(/"(\/)bower_components\/(.[^\s]*)\/([a-zA-Z0-9.\-]+\.js)(.*)"/g, '"'+ config.staticPath +'/js/$3$4"'))
              //.pipe(gulp.dest(svn.path))
              .pipe(gulp.dest(tmpPath))
  });

  // 拷贝
  gulp.task('svnCopy', function(){
      return gulp.src([config.staticPath + '/iconfont/**/**', config.staticPath + '/iconfont-ie7/**/**'], {base: 'client'})
          //.pipe($.changed(svn.staticPath))
          //.pipe(gulp.dest(svn.staticPath))
          .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  // css
  gulp.task('svnCss', function(){
      return gulp.src([config.staticPath+'/css/**/**.css'], {base: 'client'})
          .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          //.pipe($.changed(svn.staticPath))
          .pipe($.minifyCss({compatibility: 'ie7'}))
          .pipe($.header(banner, { pkg: pkg}))
          //.pipe(gulp.dest(svn.staticPath))
          .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  gulp.task('svnJs:copy', function() {
    return gulp.src([config.staticPath+'/js/**/**', !config.staticPath+'/js/**/**.js'], {base: 'client'})
        .pipe(gulp.dest(tmpPath + svn.staticPath))
  });

  // js
  gulp.task('svnJs', ['svnJs:copy'], function(){
      return gulp.src([config.staticPath+'/js/**/**.js'], {base: 'client'})
          .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          //.pipe($.changed(svn.staticPath))
          .pipe($.uglify({mangle: false}))
          .pipe($.header(banner, { pkg: pkg}))
          //.pipe(gulp.dest(svn.staticPath))
          .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  gulp.task('svnBowerJs', function(){
      return gulp.src(config.bower_source)
              //.pipe($.changed(svn.staticPath))
              //.pipe(gulp.dest(svn.staticPath+'/js'))
              .pipe(gulp.dest(tmpPath + svn.staticPath + '/js'))
  })

  // images
  gulp.task('svnImage', function(){
      return gulp.src([config.staticPath+'/images/**/**', '!'+config.staticPath+'/images/sprite/sprite-**/', '!'+config.staticPath+'/images/sprite/sprite-**/**/**'])
          .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          //.pipe($.changed(svn.staticPath))
          // 启用压缩要先安装gulp-imagemin，时间比较长
          // npm install gulp-imagemin --save
          //.pipe($.imagemin({
          //            optimizationLevel: 5,
          //            progressive: true,
          //            svgoPlugins: [{removeViewBox: false}]//,
          //           //use: [pngquant()]
          //        })
          //)
          //.pipe(gulp.dest(svn.staticPath+'/images'))
          .pipe(gulp.dest(tmpPath + svn.staticPath+'/images'))
  })

  gulp.task('svnDoc', function() {
    return gulp.src([config.docs.destPath+'/**/**', '!'+config.docs.destPath+'/template/**'])
                .pipe(gulp.dest(svn.path+'/docs'))
  });

  gulp.task('mock', function() {
    return gulp.src('../mock_data/**/**')
        .pipe(gulp.dest(svn.path+'/mock_data'))
  })

  gulp.task('build', ['svnTemplate', 'svnCopy', 'svnCss', 'svnJs', 'svnImage', 'svnBowerJs', 'svnDoc', 'mock'], function() {
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

  gulp.task('svn:zip', ['svn'], function() {
    return gulp.src(tmpPath+'/**/**')
            .pipe($.zip(pkg.name+'.zip'))
            .pipe(gulp.dest(tmpPath))
  });
}
