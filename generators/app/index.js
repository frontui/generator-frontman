'use strict';
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');
var path   = require('path');
var util   = require('util');
var config    = require('../../package.json')

// 声明构造函数，继承Yeoman
var frontmanGenerator = module.exports = function frontmanGenerator(args, options, config) {
  // 继承
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function(){
    this.log( chalk.red('FrontMan') + ' 手脚架环境已经搭建完毕，现在可以开桑玩耍了！');
  }.bind(this))

  // 读取package
  //this.pkg = config;
  //this.config = config;
}

// 继承
util.inherits(frontmanGenerator, yeoman.generators.NamedBase);

// 询问配置输入
frontmanGenerator.prototype.prompting = function askFor() {
  // 延迟执行
  var done = this.async();
  //console.log(this)

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
      default: (this.appname || config.name)
    },
    {
      type: 'input',
      name: 'version',
      message: '请输入版本号?',
      default: '1.0.0'
    },
    {
      type: 'input',
      name: 'author',
      message: '您的名字?',
      default: (config.author || 'frontui')
    },
    {
      type: 'input',
      name: 'description',
      message: '项目描述?',
      default: 'A new project named '+ (this.appname || config.name)
    },
    {
      type: 'input',
      name: 'port',
      message: '测试服务启动端口?',
      default: '8520'
    },
    {
      type: 'list',
      name: 'features',
      message: '请选择框架?',
      choices: [
        {
          name: 'frontui',
          value: 'includeFrontui',
          checked: true
        },
        {
          name: 'frontAdmin',
          value: 'includeFrontAdmin',
          checked: false
        },
        {
          name: 'frontMobile',
          value: 'includeFrontMobile',
          checked: false
        }
      ]
    }
  ];

  // 询问流程
  this.prompt(prompts, function(props) {
    var features = props.features;
    this.props = props;

    // 判断是否有其他功能
    function hasFeature(feat) {
      return features && features.indexOf(feat) !== -1;
    }

    this.includeFrontui = hasFeature('includeFrontui');
    this.includeFrontAdmin = hasFeature('includeFrontAdmin');
    this.includeFrontMobile = hasFeature('includeFrontMobile');

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
  context = util._extend(config, context);

  // 拷贝模板
  this.template('_bower.json', 'bower.json', context);
  this.template('_package.json', 'package.json', context);
  this.template('_config.json', 'config.json', context);
  this.template('_.editorconfig', '.editorconfig');
  this.template('_.gitignore', '.gitignore');
  this.template('_.jshintrc', '.jshintrc');
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
  if(this.includeFrontui){
    this.bowerInstall(['frontui', 'jquery#^1', 'html5shiv', 'respond'], { 'saveDev': true }, (function(){
      // 自动拷贝文件
      this.directory(this.destinationPath('bower_components/frontui/iconfont'), 'static/iconfont');
      this.directory(this.destinationPath('bower_components/frontui/iconfont-ie7'), 'static/iconfont-ie7');
      this.directory(this.destinationPath('bower_components/frontui/images'), 'static/images');
      this.directory(this.destinationPath('bower_components/frontui/js'), 'static/js');
      this.directory(this.destinationPath('bower_components/frontui/less'), 'static/less');

    }).bind(this));
  } 
  //if(this.includeFrontAdmin) this.bowerInstall(['frontadmin'], { 'saveDev': true });
  //if(this.includeFrontMobile) this.bowerInstall(['frontmobile'], { 'saveDev': true });

  this.installDependencies({ skipInstall: this.options['skip-install']})
}