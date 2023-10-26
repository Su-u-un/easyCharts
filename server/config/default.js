const config = {
    port:3002,
    // 配置连接项
    database:{
        host : 'localhost', //连接的数据库地址。（默认:localhost）
        user : 'root', //mysql的连接用户名
        password : '123456', // 对应用户的密码
        database : 'easycharts' //所需要连接的数据库的名称（可选）
    }
}

module.exports = config