const dataDB = require('../models/DataModel')

// dataSet
exports.dataSetList = async (req,res)=>{
    const data = req.query
    await dataDB.dataSetList(data).then(result=>{
        res.send({
            code: '0',
            records: result[0],
            total: result[1][0].total
        })
    })
}
exports.dataSetById = async (req,res)=>{
    
}
exports.dataSetSave = async (req,res)=>{
    
}


// dataMeta
exports.queryNeedByDataSetId = async (req,res)=>{
    const data = req.query
    await dataDB.queryNeedByDataSetId([data.id]).then(result=>{
        res.send({
            code: '0',
            data: result
        })
    })
}

// dataSource
exports.dataSourceList = async (req,res)=>{
    const data = req.query
    const size = parseInt(data.size)
    const current = parseInt(data.current)-1
    if(data.name){
        await dataDB.dataSourceList1([data.name, size, current, data.name]).then(result=>{
            res.send({
                code: '0',
                records: result[0],
                total: result[1][0].total
            })
        })
    }else{
        await dataDB.dataSourceList2([size, current]).then(result=>{
            res.send({
                code: '0',
                records: result[0],
                total: result[1][0].total
            })
        })
    }  
}

exports.dataSourceById = async (req,res)=>{
    const data = req.query
    await dataDB.dataSourceById(data.id).then(result=>{
        if(result[0].is_enable){
            result[0].is_enable = true
        }else{
            result[0].is_enable = false
        }
        res.send({
            code: '0',
            data: result
        })
    })
}
exports.dataSourceSave = async (req,res)=>{
    const data = req.body
    let temp = []
    for(const i in data){
        if(i === 'id'){
            continue
        }
        else if(i==='is_enable'){
            if(data[i] === 'true'){
                temp.push(i + '= 1')
            }else{
                temp.push(i + '= 0')
            }
        }
        else temp.push(i + '=\'' + data[i]+'\'')
    }
    const a = temp.toString()
    await dataDB.dataSourceSave(a,data.id).then(result=>{
        if (result.length === 0) {
            res.send({
                code: "-2",//返回信息
                error: "错误，请联系管理员"
            })
        }else{
            res.send({
                code: "0",//返回信息
                msg:"success"
            })
        }
    })
}
exports.dataSourceTest = async (req,res)=>{
    const data = req.body
    const tempConfig = {
        host: data.host,
        port: data.port,
        user: data.username,
        password: data.password,
        database: data.database_name,
        multipleStatements: true
    }
    await dataDB.dataSourceTest(tempConfig).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send(err)
    })
}
exports.dataSourceDelete = async (req,res)=>{
    const data = req.query
    await dataDB.dataSourceDelete(data.id).then(result=>{
        if (result.length === 0) {
            res.send({
                code: "-2",//返回信息
                error: "错误，请联系管理员"
            })
        }else{
            res.send({
                code: "0",//返回信息
                msg:"success"
            })
        }
    })
}