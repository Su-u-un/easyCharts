const controller = require('../controllers/EchartsControllers');

module.exports = function(app){
    app.post('/echarts/save', (req, res) => {
        controller.save(req, res);
    });
    app.post('/echarts/update', (req, res) => {
      controller.update(req, res);
    });
    app.post('/echarts/show', (req, res) => {
      controller.show(req, res);
    })
    app.post('/echarts/delete', (req, res) => {
      controller.delete(req, res);
    })
}


// const express = require('express');
// const router = express.Router();
// /* GET users listing. */
// router.get('/echarts/save', function(req, res) {
//   // 发送一个响应
//   res.send('add echarts');
// });

// module.exports = router;