const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 解析html
const ejs = require('ejs');

const app = express();

// 获取静态路径
// app.use(express.static(__dirname + '/dist')) // 在前端打包完成后，把打包完成的东西放在后端的目录内
// app.use(express.static(__dirname + '/data')) // 一些不放在数据库的东西，例如图片

// 后端配置跨域(前端做了代理，后端不需要了)
// app.all('*',function(req,res,next){
//   // 允许访问所有ip
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin","X-Requested-With","Content-Type","Accept");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By",' 3.2.1');
//   res.header("Content-Type", "application/json;charset=utf-8");
//   // 让options请求快速返回
//   if(req.method=="OPTIONS") return res.send(200);
//   else next();
// })

// 加入html视图
app.set('views', path.join(__dirname, 'views'));
app.engine('html',ejs.__express);
app.set('view engine','html');

// 解析前端数据
app.use(express.json());
// 解析数据值的方式，true表示可以是任何类型，false表示只能是字符串或数组
app.use(express.urlencoded({ extended: true })); 

// 引入路由
/**
 * 注释掉的写法
 * const usersRouter = require('./routes/users');
 * app.use('/users', usersRouter);
*/

// 也可以写成如下格式
require('./routes/users')(app)
require('./routes/echarts')(app)

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(cookieParser());

// 捕获请求 传递404的中间件
app.use(function(req, res, next) {
  next(createError(404));
});

// 处理错误
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 导出app，通过/bin/www启动
module.exports = app;
