const controller = require('../controllers/UsersControllers');
const captcha = require('captchapng')

module.exports = function(app){
    // 登录
    app.post('/users/login', (req, res) => {
      if (!req.session.captcha) {//验证是否过期或者被篡改
        // const error = new Error(erroType.SVG_COOKIE_IS_TIMEOUT);
        res.status(403).send({code:"-1",error:"验证码已过期，请重新申请"})
      }else if(req.body.code !== req.session.captcha){
        res.status(403).send({code:"-1",error:"验证码有误，请重新输入"})
      }else{
        controller.login(req, res);
      }
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
    app.get('/users/getCaptcha', async (req, res) => {
      // 随机验证码
      const temp = parseInt(Math.random()*9000+1000)
      const value = temp.toString();
      // 生成验证码png
      const p = new captcha(100,30,value);
      p.color(72,201,176,128);  // First color: background (red, green, blue, alpha)
      p.color(255, 248, 220, 128); // Second color: paint (red, green, blue, alpha)
      // 转化base64
      const img = p.getBase64();
      // 存入session
      req.session.captcha = value;
      console.log(value)
      await res.send({
          ActionType: "OK",
          code: 0,
          data: img
      });
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