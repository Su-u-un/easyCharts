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