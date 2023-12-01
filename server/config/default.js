const config = {
    // 服务端端口
    port:3002,
    // db配置
    database:{
        host : 'localhost', //连接的数据库地址。（默认:localhost）
        user : 'root', //mysql的连接用户名
        password : '123456', // 对应用户的密码
        database : 'easycharts', //所需要连接的数据库的名称（可选）
        multipleStatements: true
    },
    // session配置
    session:{
        name: "captcha", // 返回客户端key的名称
        secret: 'sun' , //加密字符串 
        resave:  true , //强制保存session，即使它没有变化 
        saveUninitialized:  true , //强制将未初始化的session存储。当新建一个session且未设定属性或值时，它就处于未初始化状态。在设定cookie前，这对于登录验证，减轻服务器存储压力，权限控制是有帮助的，默认为true 
        cookie: {maxAge:1000 * 6} , // 5m 
        rolling: false ,  // 是否每次响应时刷新Session的有效期
    
        // maxAge: 180000, // session 过期时间，以毫秒ms为单位计算 
        // overwrite: true,//是否允许重写 。(默认是 true) 
        // httpOnly: true,//是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。
        // signed: true,//是否签名。(默认是 true) 
        // renew: false,//是否在Session快过期时刷新Session的有效期
    }
}

module.exports = config