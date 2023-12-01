const controller = require('../controllers/DataControllers')

module.exports = function(app){
    app.get('/data/dataSet/list',(req,res)=>{
        controller.dataSetList(req,res)
    })
    app.get('data/dataSet/queryById',(req,res)=>{
        controller.dataSetById(req,res)
    })
    app.post('/data/dataSet/save',(req,res)=>{
        controller.dataSetSave(req,res)
    })

    app.get('/data/dataSource/list',(req,res)=>{
        controller.dataSourceList(req,res)
    })
    app.get('/data/dataSource/queryById',(req,res)=>{
        controller.dataSourceById(req,res)
    })
    app.get('/data/dataSource/delete',(req,res)=>{
        controller.dataSourceDelete(req,res)
    })
    app.post('/data/dataSource/save',(req,res)=>{
        controller.dataSourceSave(req,res)
    })
    app.post('/data/dataSource/test',(req,res)=>{
        controller.dataSourceTest(req,res)
    })


    app.get('/data/dataMeta/queryNeedByDataSetId',(req,res)=>{
        controller.queryNeedByDataSetId(req,res)
    })
}