# generator开发文档

安装 `bower`

```
	npm i bower -g
```

安装 `yo`

```
	npm i yo -g
```

安装 `gulp`

```
	npm i gulp -g
```

安装 `generator-generator`

```
	npm i generator-generator -g
```

切换到generator项目目录

```
	yo generator
```

输入项目名称

```
	frontman
```

本地调试开发，切换到生成文件夹`generator-frontman`

```
	npm link
```

切换到实例项目

```
	yo frontman
```

`done!`

## 发布到npm

在[npm官网](https://www.npmjs.org)注册一个用户

在当前`generator`目录使用命令提示符

```
  npm addUser
```

输入刚注册的用户名

```
  npm publish
```

发布到npm上，打开npm官网我们可以看到已经注册的`generator` npm包。

### 维护

我们只要维护github上面的`generator-frontman`项目,如果npm包需要更新版本，只要修改`package.json`的`version`字段
