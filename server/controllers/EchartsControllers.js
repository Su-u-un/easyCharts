const echartsDB = require('../models/EchartsModel')
const usersDB = require('../models/UsersModel')
const dataDB = require('../models/DataModel')

exports.save = async (req, res) => {
    const data = req.body
    await echartsDB.exist([data.name])
        .then(exist => {
            // 不存在则新建
            if (exist.length === 0) {
                echartsDB.save([data.name, data.data_id, data.creator_id, data.code])
                    .then(result => {
                        res.send({
                            code: '0',
                            message: result
                        })
                    }).catch(err => {
                        res.send({
                            code: '-2',
                            error: err,
                            message:'请联系管理员'
                        })
                    })
            }else{
                res.send({
                    code: '-2',
                    error: '组件已存在'
                })
            }
        }).catch(err => {
            res.send({
                code: '-2',
                error: err,
                message:'请联系管理员'
            })
        })
}

exports.update = async (req, res) => {
    const data = req.body
    // 判断是否已存在此组件
    await echartsDB.update([data.code, data.name])
        .then(result => {
            if(result.length === 0){
                res.send({
                    code: '-2',
                    error: '组件不存在'
                })
            }else if (result.affectedRows !== 1) {
                res.send({
                    code: '-2',
                    error: '修改失败'
                })
            }else{
                res.send({
                    code: '0',
                    message: '修改成功'
                })
            }
            
        }).catch(err => {
            res.send({
                code: '-2',
                message:'请联系管理员'
            })
            console.log(err)
        })
}

exports.show = async (req, res) => {
    const data = req.body
    await echartsDB.show([data.name])
        .then(result => {
            if(result.length === 0){
                res.send({
                    code: '-2',
                    error: '组件不存在'
                })
            }else{
                res.send({
                    code: '0',
                    message: result
                })
            }
        }).catch(err => {
            res.send({
                code: '-2',
                message:'请联系管理员'
            })
            console.log(err)
        })
}

exports.delete = async (req, res) => {
    const data = req.body
    // 判断是否已存在此组件
    await echartsDB.delete([data.name])
        .then(result => {
            if(result.length === 0){
                res.send({
                    code: '-2',
                    error: '组件不存在'
                })
            }else if (result.affectedRows !== 1) {
                res.send({
                    code: '-2',
                    error: '删除失败'
                })
            }else{
                res.send({
                    code: '0',
                    message: '删除成功'
                })
            }
        }).catch(err => {
            res.send({
                code: '-2',
                message:'请联系管理员'
            })
            console.log(err)
        })
            
}

exports.list = async (req, res) => {
    const data = req.query
    const size = parseInt(data.size)
    const current = parseInt(data.current)-1
    if(data.name){
        await echartsDB.list1([data.name, size, current, data.name]).then(async list => {
            for(let i in list){
                await usersDB.infoByID(list[i].create_by).then(result => {
                    list[i].create_by = result[0]
                })
                await dataDB.infoByID(list[i].data_set_id).then(result => {
                    list[i].data_set_id = result[0]
                })
            }
            res.send({
                code: '0',
                records: list[0],
                total: list[1][0].total
            })
        })
    }else{
        // data有current当前页和size每页数据条数、name，name可以是空
        await echartsDB.list2([size,current]).then(async list => {
            for(let i in list[0]){
                await usersDB.infoByID(list[0][i].create_by).then(result => {
                    list[0][i].create_by = result[0]
                })
                await dataDB.infoByID(list[0][i].data_set_id).then(result => {
                    list[0][i].data_set_id = result[0]
                })
            }
            res.send({
                code: '0',
                records: list[0],
                total: list[1][0].total
            })
        })
    }
    
}

exports.queryDesignById = async (req,res)=>{
    const data = req.query
    let x = []
    let y = []
    await echartsDB.queryDesignById(data.id).then(async list=>{
        await dataDB.queryNeedByDataSetId([list[0].data_set_id,list[0].xnames]).then(result => {
            x = result
        })
        await dataDB.queryNeedByDataSetId([list[0].data_set_id,list[0].ynames]).then(result => {
            y = result
        })

        res.send({
            code: '0',
            echarts:Object.assign(list[0],{
                "dataSet":{"id":list[0].data_set_id}
            }),
            yColumnList:y,
            xColumnList:x
        })
    })
}

exports.mergeChartData = async (req,res)=>{
    const data = req.query
    const temp = Object.assign({},data)
    const arr = []
    delete temp.dataSetId
    for(const i in temp){
        const arrtemp = temp[i].split(',')
        for(const j in arrtemp){
            arr.push(arrtemp[j])
        }
    }
    await dataDB.infoByID(data.dataSetId).then(async result=>{
        console.log(result);
        await echartsDB.test(result[0].sql_cmd).then(list=>{
            res.send({
                code: '0',
                columns:arr,
                rows:list
            })
        })
    })
}