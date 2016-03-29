'use strict';
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');
var path   = require('path');
var util   = require('util');
var config    = require('../../package.json')
var replace = require('replace')

// 声明构造函数，继承Yeoman
var frontmanGenerator = module.exports = function frontmanGenerator(args, options, config) {
  // 继承
  yeoman.generators.Base.apply(this, arguments);

  var cwd = this.env.cwd;

  this.on('end', function(){

    // 替换路径
      replace({
        regex: "../bower_components",
        replacement: "../../bower_components",
        paths: [cwd+'/static/less'],
        recursive: true,
        silent: true
      })
      //this.spawnCommand('replace "../bower_components" "../../bower_components" ./static/less -r');

      console.log('replace the path of bower_components is success!');

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
      message: '请选择MVC框架?',
      choices: [
        {
          name: 'none',
          value: 'none',
          checked: true
        },
        {
          name: 'angluar',
          value: 'includeAngular',
          checked: false
        },
        {
          name: 'vuejs',
          value: 'includeVuejs',
          checked: false
        },
        {
          name: 'react',
          value: 'includeReact',
          checked: false
        },
        {
          name: 'backbone',
          value: 'includeBackbone',
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

    this.includeAngular = hasFeature('includeAngular');
    this.includeVuejs = hasFeature('includeVuejs');
    this.includeReact = hasFeature('includeReact');
    this.includeBackbone = hasFeature('includeBackbone');
    this.includeDefault = hasFeature('none');

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
  this.directory('doc', 'doc');
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
}

// 安装npm 包
frontmanGenerator.prototype.install = function(){

  // 延迟执行
  //var done = this.async();

  if(this.includeAngular) this.bowerInstall(['angular', 'angular-route', 'angular-touch'], { 'saveDev': true });
  if(this.includeVuejs) this.bowerInstall(['vue', 'vue-touch'], { 'saveDev': true });
  if(this.includeReact) this.bowerInstall(['react'], { 'saveDev': true });
  if(this.includeBackbone) this.bowerInstall(['backbone', 'underscore', 'jquery'], { 'saveDev': true });

  // 默认安装 frontui-mobile
  if(this.includeDefault) {
    console.log('------ install frontui-mobile --------');
    this.npmInstall(['frontui-mobile'], { 'saveDev': true }, (function() {
      // 自动拷贝文件
      this.directory(this.destinationPath('node_modules/frontui-mobile/js'), 'static/js');
      this.directory(this.destinationPath('node_modules/frontui-mobile/images'), 'static/images');
      this.directory(this.destinationPath('node_modules/frontui-mobile/less'), 'static/less');
      this.directory(this.destinationPath('node_modules/frontui-mobile/iconfont'), 'static/iconfont');

      //done();

    }).bind(this));
  }

  this.installDependencies({ skipInstall: this.options['skip-install']})
}
