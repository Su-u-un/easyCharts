const db = require('./index')

// 用户登录
exports.login =(value)=>{
    const _sql = `SELECT * FROM users WHERE username = ? AND password = ?;`
    return db.query(_sql,value)
}

// 用户注册
exports.register =(value)=>{
    const _sql = `INSERT INTO users SET username=?,password=?`
    return db.query(_sql,value)
}

// 用户是否存在
exports.exist =(value)=>{
    const _sql = "SELECT * FROM users WHERE username = ?";
    return db.query(_sql,value)
}