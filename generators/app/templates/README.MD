# frontman前端手脚架模板

## 简介

`frontman`的目的是快速构建前端开发项目所需要的工具及基础配置，前端开发人员可以使用`yo frontman`命令生成基本项目框架后，再根据项目实际情况对配置进行调整。

## 快速开始

系统需要安装`nodejs`及`Yeoman`工作套件(`yo`, `Bower`, `Gulp`)

## 文件结构说明

  * `lib` - gulpfile需要工具库函数
  * `task` - gulpfile任务目录
    * `defaultTask.js` 默认task
    * `svnTask.js` svn任务
  * `static` - 静态文件目录
    * images - 图片路径
    * js - js路径
    * less - less目录
    * css - less编译后目录
  * `template` - nunjucks动态模板
    * `_components` - 通用组件模板
    * `_layout`  - 全局布局框架模板
    * `index.html` - 模板文件
  * `www` -  编译预览模板目录
  * `config.json` - 个性配置文件
  * `gulpfile.js` - 构建环境主文件
  * `package.json` - 项目描述文件
  * `README.MD` - 文档说明
  * `svn.json` - svn个性化配置
  * `.gitignore` - github版本忽略文件配置文件
  * `bower.json` - bower 安装配置
  * `editorconfig` - 编辑器代码格式统一配置文件
  * `jshintrc` - javascript语法检查配置文件

## 配置

### bower配置说明

需要第三方库支持，直接

    bower install frontui --save

### Gulp配置说明
