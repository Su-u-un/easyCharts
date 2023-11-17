const controller = require('../controllers/UsersControllers');

module.exports = function(app){
  app.post('/users/login', (req, res) => {
      controller.login(req, res);
    });
    app.post('/users/register', (req, res) => {
      controller.register(req, res);
    });
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