const db = require('./index')

// 组件是否存在
exports.exist =(value)=>{
    const _sql = "SELECT * FROM echarts WHERE name = ?";
    return db.query(_sql,value)
}

// 新建组件
exports.save = (value)=>{
    const _sql = `INSERT INTO echarts SET name=?,data_id=?,creator_id=?,code=?;`
    return db.query(_sql,value)
}
// 修改组件
exports.update = (value)=>{
    const _sql = `UPDATE echarts SET code = ? WHERE name = ? ;`
    return db.query(_sql,value)
}
// 查看组件
exports.show = (value)=>{
    const _sql = `SELECT * FROM echarts WHERE name = ?`
    return db.query(_sql,value)
}
// 删除组件
exports.delete = (value)=>{
    const _sql = `DELETE FROM echarts WHERE name = ?`
    return db.query(_sql,value)
}

exports.list1 = (value)=>{
    const sql1 = `SELECT *
        FROM echarts
        WHERE name LIKE ?
        LIMIT ? 
        OFFSET ?;`
    const sql2 = `SELECT COUNT(*) as total
        FROM echarts
        WHERE name LIKE ?`
    return db.query(sql1+sql2,value)
}
exports.list2 = (value)=>{
    const sql1 = `SELECT *
        FROM echarts
        LIMIT ? 
        OFFSET ?;`
    const sql2 = `SELECT COUNT(*) as total
        FROM echarts;`
    return db.query(sql1+sql2,value)
}

exports.queryDesignById = (value)=>{
    const sql1 = `SELECT *
        FROM echarts
        WHERE id = ?;`
    return db.query(sql1,value)
}

exports.mergeChartData = (value)=>{
    const _sql = `SELECT * 
        FROM echarts 
        WHERE name = ?`
    return db.query(_sql,value)
}

exports.test = (value)=>{
    const _sql = value
    return db.query(_sql)
}