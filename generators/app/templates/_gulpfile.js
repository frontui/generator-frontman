/**
 *! frontman 手脚架
 * v0.1.0
 * (c) frontui team
 */

var config = require('./config.json')
var pkg    = require('./package.json')
var svn    = require('./svn.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()

/*--- 公用函数 ---*/
// 静态文件头部注释banner
var banner = [
  '/*! <%= pkg.name%> v<%= pkg.version%>',
  '*  by <%= pkg.author%>',
  '*  (c) 2014-'+ $.util.date(Date.now(), 'UTC:yyyy') + ' www.frontpay.cn',
  '* updated on '+ $.util.date(Date.now(), 'UTC:yyyy-mm-dd'),
  '*  Licensed under <%= pkg.license %>',
  '*/',
  ' '
].join('\n');

// 服务启动根目录
var serverRoot = __dirname

/*-------------
*  默认任务
-------------*/
var task = require('./task/defaultTask');
task(serverRoot);


/*-------------
*  svn任务
-------------*/
var svnTask = require('./task/svnTask');
svnTask(banner);
