const db = require('./index')

// // 创建表
// exports.create = (value)=>{
//     let _sql = `CREATE TABLE IF NOT EXISTS ${value.name} ;`
//     return db.query(_sql, []);
// }

// 查看数据模型
exports.infoByID = (value)=>{
    const _sql = `SELECT * 
        FROM data_set_model 
        WHERE id = ?`
    return db.query(_sql,value)
}
// dataSet
exports.dataSetList = (value)=>{
    const sql1 = `SELECT *
        FROM data_set_model
        WHERE del_flag = 0;`
    const sql2 = `SELECT COUNT(*) as total
        FROM data_set_model
        WHERE del_flag = 0;`
    return db.query(sql1+sql2,value)
}

// dataMeta
exports.queryNeedByDataSetId = (value)=>{
    if(value[1]){
        const _sql = `SELECT *
            FROM data_set_meta
            WHERE del_flag = 0 
            AND is_need = 1
            AND data_set_id = ?
            AND name = ?;`
        return db.query(_sql,value)
    }
    else{
        const _sql = `SELECT *
            FROM data_set_meta
            WHERE del_flag = 0 
            AND is_need = 1
            AND data_set_id = ?;`
        return db.query(_sql,value)
    }
}

// dataSource
exports.dataSourceList1 = (value)=>{
    const sql1 = `SELECT *
        FROM data_set_source
        WHERE del_flag = 0
        AND name LIKE ?
        LIMIT ? 
        OFFSET ?;`
    const sql2 = `SELECT COUNT(*) as total
        FROM data_set_source
        WHERE del_flag = 0
        AND name LIKE ?;`
    return db.query(sql1+sql2,value)
}
exports.dataSourceList2 = (value)=>{
    const sql1 = `SELECT *
        FROM data_set_source
        WHERE del_flag = 0
        LIMIT ? 
        OFFSET ?;`
    const sql2 = `SELECT COUNT(*) as total
        FROM data_set_source
        WHERE del_flag = 0;`
    return db.query(sql1+sql2,value)
}

exports.dataSourceById = (value)=>{
    const _sql = `SELECT *
        FROM data_set_source
        WHERE id = ?;`
    return db.query(_sql,value)
}

exports.dataSourceSave = (data,value)=>{
    const _sql = `UPDATE data_set_source SET ${data} WHERE id = ? `
    return db.query(_sql,value)
}

exports.dataSourceTest = (value)=>{
    const test = db.connect(value)
        return new Promise((resolve,reject)=>{
        test.getConnection((err, connection)=>{
            if(err){
                reject('连接错误')
            }
            else{
                resolve('连接成功')
                connection.release()
            }
        })
    })
}

exports.dataSourceDelete = (value)=>{
    const _sql = `UPDATE data_set_source SET del_flag = 1 WHERE id = ? `
    return db.query(_sql,value)
}

// // 修改组件
// exports.update = (value)=>{
//     const _sql = `UPDATE ${value.name} SET code = ? WHERE name = ? ;`
//     return db.query(_sql,value)
// }
// // 查看组件
// exports.show = (value)=>{
//     const _sql = `SELECT * FROM echarts WHERE name = ?`
//     return db.query(_sql,value)
// }
// // 删除组件
// exports.delete = (value)=>{
//     const _sql = `DELETE FROM echarts WHERE name = ?`
//     return db.query(_sql,value)
// }