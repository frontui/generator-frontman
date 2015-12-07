# <%= name %>

## 简介

<%= description %>

## 快速开始

    gulp

## 发布

    gulp svn

## 开发

    基于阿里无线`flexible`与`gulp-px3rem`

    [https://github.com/tomieric/flexible-h5-base-demo](https://github.com/tomieric/flexible-h5-base-demo)    

默认为`750px`设计稿,`dpr=2`

容器宽高直接用设计稿的标注宽高，构建工具自动转成`rem`

**注意**: 字体大小必须用`px`单位，避免`rem`单位小数点四舍五入问题。

    body {
      font-size: 24px; /*px*/
    }

在不需要转换的的语句后面添加`/*px*/`注释，构建工具将保留`px`单位，且生成多`dpr`的声明。比如上面定义的字体

    body[dpr="1"] {
      font-size: 12px;
    }
    body[dpr="2"] {
      font-size: 24px;
    }
    body[dpr="3"] {
      font-size: 48px;
    }
