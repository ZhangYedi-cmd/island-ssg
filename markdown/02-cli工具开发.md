# cli 工具开发

## npm package 开发和调试链路

对于一个完整的npm package来讲，完整的开发和调试链路应该是怎样的？ 

首先，我们要开发一个npm package，要选用合适的构建工具，在本项目中我们使用的是tsup，开发阶段，启动tsup --watch
命令，tsup就会实时更新我们更改的代码，重新构建并输出结果。

所以，此项目完整的开发链路应该是：code -> tsup -> dist

如果我们要对我们的package进行调试，应该如何处理呢？

一般我们都是通过npm link去做，tsup会实时将我们的code输出到dist目录，那么我们就可以创建bin目录，并在package.json中
声明bin字段，这个字段的值指向了bin目录下的文件，这个文件会导入dist目录的入口文件,也就会执行打包后的code。

在根目录下执行npm link后，npm会帮我们创建一个全局的软链接，之后如果我们在终端中执行package.json中声明的bin字段，就会执行这个字段指向的文件。 


所以，梳理一下调试的链路：item -> npm link -> project/bin/xxx.js -> dist

开发和调试的整体链路： code -> tsup -> dist <- project/bin/xxx.js <- npm link <- item 

## cli 工具

本项目中Cli工具应该具备的功能点：
* 开发环境下调试
* 生产环境构建
* 版本号输出 help .....

技术选型问题，技术选型应该看哪些点？ 

开源社区，Star数，issue，是否处于维护状态。

