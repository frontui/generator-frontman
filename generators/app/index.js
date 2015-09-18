'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var util = require('util');
var pkg = require('../../package.json')

// 声明构造函数，继承Yeoman
var frontmanGenerator = module.exports = function frontmanGenerator(args, options, config) {
  // 继承
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function(){
    this.log( chalk.red('FrontMan') + ' 手脚架环境已经搭建完毕，现在可以开桑玩耍了！');
  }.bind(this))

  // 读取package
  this.pkg = pkg;
}

// 继承
util.inherits(frontmanGenerator, yeoman.generators.NamedBase);

// 询问配置输入
frontmanGenerator.prototype.prompting = function askFor() {
  // 延迟执行
  var done = this.async();

  // 欢迎banner
  this.log(yosay(
        '欢迎使用 ' + chalk.red('Frontman') + ' generator 手脚架!'
  ));

  // 输入配置
  var prompts = [
    {
      type: 'input',
      name: 'name',
      message: '请输入新建项目名字?',
      default: this.appname
    },
    {
      type: 'input',
      name: 'author',
      message: '您的名字?',
      default: (this.pkg.author || 'frontui')
    },
    {
      type: 'input',
      name: 'description',
      message: '项目描述?',
      default: 'A new project named '+ this.appname
    },
    {
      type: 'input',
      name: 'port',
      message: '测试服务启动端口?',
      default: '8520'
    }
  ];

  // 询问流程
  this.prompt(prompts, function(props) {
    this.props = props;
    // 执行下一个任务
    done();
  }.bind(this))
}

// 创建新项目目录
frontmanGenerator.prototype.app = function app() {
  // 拷贝目录
  this.directory('static', 'static');
  this.directory('template', 'template');
  this.directory('task', 'task');
  this.directory('lib', 'lib');
  this.log('static & template 目录创建完毕！');
}

// 创建项目配置文件
frontmanGenerator.prototype.projectfiles = function projectfiles() {
  var context = this.props;

  // 拷贝模板
  this.template('_bower.json', 'bower.json', context);
  this.template('_package.json', 'package.json', context);
  this.template('_config.json', 'config.json', context);
  this.template('_editorconfig', 'editorconfig');
  this.template('_.gitignore', '.gitignore');
  this.template('_jshintrc', 'jshintrc');
  this.template('_svn.json', 'svn.json', context);
  this.template('_gulpfile.js', 'gulpfile.js');
  this.template('_README.MD', 'README.MD', context);
  /*this.fs.copyTpl(
    this.templatePath('_bower.json'),
    this.destinationPath('bower.json'),
    context
  );
  this.fs.copyTpl(
    this.templatePath('_package.json'),
    this.destinationPath('package.json'),
    context
  );
  this.fs.copyTpl(
    this.templatePath('_config.json'),
    this.destinationPath('config.json'),
    context
  );
  this.fs.copyTpl(
    this.templatePath('_editorconfig'),
    this.destinationPath('editorconfig')
  );
  this.fs.copyTpl(
    this.templatePath('_.gitignore'),
    this.destinationPath('.gitignore')
  );
  this.fs.copyTpl(
    this.templatePath('_jshintrc'),
    this.destinationPath('jshintrc')
  );
  this.fs.copyTpl(
    this.templatePath('_svn.json'),
    this.destinationPath('svn.json'),
    context
  );
  this.fs.copyTpl(
    this.templatePath('_gulpfile.js'),
    this.destinationPath('gulpfile.js')
  );
  this.fs.copyTpl(
    this.templatePath('_README.MD'),
    this.destinationPath('README.MD'),
    context
  );*/
}

// 安装npm 包
frontmanGenerator.prototype.install = function(){
  this.installDependencies({ skipInstall: this.options['skip-install']})
}
