const controller = require('../controllers/UsersControllers');

module.exports = function(app){
    // 登录
    app.post('/users/login', (req, res) => {
      controller.login(req, res);
    });
    // 注册
    app.post('/users/register', (req, res) => {
      controller.register(req, res);
    });
    // 修改密码
    app.post('/users/updatePWD', (req, res) => {
      controller.updatePWD(req, res);
    });
    // 查询信息
    app.get('/users/info', (req, res) => {
      controller.info(req, res);
    });
    // 验证码
    app.get('/users/getCaptcha', (req, res) => {
      controller.getCaptcha(req, res);
    })
}



// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// router.get('/login', function(req, res, next) {
//   res.send('aaaaaaaaa');
// });

// module.exports = router;