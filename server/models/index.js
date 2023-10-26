const mysql = require('mysql');
const config = require('../config/default');

// 建立mysql连接
const db = mysql.createConnection({
    host:config.database.host,	//连接的数据库地址
    user:config.database.user,	//mysql的连接用户名
    password:config.database.password,	// 对应用户的密码
});

// 连接指定数据库
const pool = mysql.createPool({
    host:config.database.host,	//连接的数据库地址
    user:config.database.user,	//mysql的连接用户名
    password:config.database.password,	// 对应用户的密码
    database:config.database.database,	//所需要连接的数据库的名称（可选）
});



// 直接使用整个sql
exports.dbbs = (sql,values) => {
    return new Promise((resolve,reject)=>{
        db.query(sql, values, (err, result) => {
            if(err) reject(err)
            else resolve(result)
        })
    })
}

// 直接使用pool
exports.query = (sql,values) => {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err, connection) => {
            if(err) reject(err)
            else{
                connection.query(sql, values, (err, rows) => {
                    if(err) reject(err)
                    else resolve(rows)
                    // 释放链接
                    connection.release()
                })
            }
        })
    })
}