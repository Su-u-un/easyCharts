const db = require('./index')

// 创建表
exports.create = (value)=>{
    let _sql = `CREATE TABLE IF NOT EXISTS ${value.name} ;`
    return db.query(_sql, []);
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