/**
 * 生成环境，更新到TFS
 *
 * npm install gulp-tfs-fp --save-dev
 */
var gulp = require('gulp');
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

var TFS    = require('gulp-tfs-fp')


module.exports = function svnTask(banner) {
  // 临时文件夹
  var tmpPath = './tmp';

  // 模板
  gulp.task('svnTemplate', function(){
      return gulp.src(['./'+ config.destPath + '/**/**.html'])
              .pipe($.prettify({indent_size: 2}))
              .pipe($.replace(/\/static/g, './static'))
              .pipe($.replace(/"(\/)bower_components\/(.*)\/([a-zA-Z0-9.]+\.js)(.*)"/g, '"'+ config.staticPath +'/js/$3$4"'))
              .pipe(gulp.dest(tmpPath))
  });

  // 拷贝
  gulp.task('svnCopy', function(){
      return gulp.src([config.staticPath + '/iconfont/**/**', config.staticPath + '/iconfont-ie7/**/**'], {base: 'client'})
          .pipe($.changed(svn.staticPath))
          .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  // css
  gulp.task('svnCss', function(){
      return gulp.src([config.staticPath+'/css/**/**.css'], {base: 'client'})
          .pipe($.plumber( { errorHandler: Lib.errHandler } ))
          //.pipe($.changed(svn.staticPath))
          .pipe($.minifyCss({compatibility: 'ie7'}))
          .pipe($.header(banner, { pkg: pkg}))
          .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  // js
  gulp.task('svnJs', function(){
      return gulp.src([config.staticPath+'/js/**/**.js'], {base: 'client'})
          .pipe($.plumber( { errorHandler: Lib.errHandler } ))
          //.pipe($.changed(svn.staticPath))
          .pipe($.uglify({mangle: false}))
          .pipe($.header(banner, { pkg: pkg}))
          .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  gulp.task('svnBowerJs', function(){
      return gulp.src(config.bower_source)
              //.pipe($.changed(svn.staticPath))
              .pipe(gulp.dest(tmpPath + svn.staticPath + '/js'))
  })

  // images
  gulp.task('svnImage', function(){
      return gulp.src([config.staticPath+'/images/**/**', '!'+config.staticPath+'/images/sprite/sprite-**/', '!'+config.staticPath+'/images/sprite/sprite-**/**/**'])
          .pipe($.plumber( { errorHandler: Lib.errrHandler } ))
          //.pipe($.changed(svn.staticPath))
          .pipe($.imagemin({
                      optimizationLevel: 5,
                      progressive: true,
                      svgoPlugins: [{removeViewBox: false}]//,
                      //use: [pngquant()]
                  })
          )
          .pipe(gulp.dest(tmpPath + svn.staticPath+'/images'))
  })

  gulp.task('svnDoc', function() {
    return gulp.src([config.docs.destPath+'/**/**', '!'+config.docs.destPath+'/template/**'])
                .pipe(gulp.dest(svn.path+'/docs'))
  });

  gulp.task('zip', ['svnTemplate', 'svnCopy', 'svnCss', 'svnJs', 'svnImage', 'svnBowerJs', 'svnDoc'],function() {
    return gulp.src(tmpPath+'/**/**')
            .pipe($.zip(pkg.name+'.zip'))
            .pipe(gulp.dest(tmpPath))
  });

  gulp.task('build', ['zip'], function() {
    return gulp.src(tmpPath+'/**/**')
              .pipe(gulp.dest(svn.path))
  })

  gulp.task('removeTmp', function(cb) {
    del([tmpPath, tmpPath+'/**/**'], cb)
  })

  gulp.task('svnServer', ['build'], function(){
      connect.server({
          root: svn.path,
          port: svn.port
      });

      console.log('server start at: http://'+ Lib.getIPAdress() +':' + svn.port + '/')

      Lib.openUrl('http://'+ Lib.getIPAdress() +':' + svn.port + '/')

      // 删除临时文件夹
      del([tmpPath, tmpPath+'/**/**']);
  })

  /*gulp.task('svn', function(){
      gulp.start(['svnServer']);
  });*/

  gulp.task('tfs:checkout', ['svn'], function() {
    return gulp.src(svn.path)
            .pipe(TFS.checkout())
  })

  gulp.task('tfs', ['tfs:checkout'], function() {
    return gulp.src(svn.path)
                .pipe(TFS.checkin("auto update"))
  })
}
