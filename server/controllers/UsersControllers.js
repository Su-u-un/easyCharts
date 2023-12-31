const JWT = require('../util/JWT');
const usersDB = require('../models/UsersModel')

exports.login = async (req,res)=>{
    const data = req.body
    if(!data.username||!data.password){
        res.send({
            code: "-2",//返回信息
            error: "用户名密码不能为空"
        })
        return
    }
    await usersDB.login([data.username,data.password])
    .then(result=>{
        // 登录校验
        if (result.length === 0) {
            res.send({
                code: "-2",//返回信息
                error: "用户名密码不匹配"
            })
        } else {
            // 生成token(用户信息,有效时间7天)
            const token = JWT.generate({
                _id: result[0]._id,
                username: result[0].username
            }, "5d")
            res.header("Authorization",token)//同时将token在响应头中返回给前端
            res.send({
                code: "0",//返回信息，
                msg:"success",
                data:token
            })
        }
    })
}

exports.register = async (req,res)=>{
    const data = req.body
    // 处理发来的参数，防止数据库操作报错
    if(!data.username||!data.password){
        res.send({
            code: "-2",//返回信息
            error: "用户名密码不能为空"
        })
        return
    }
    // 判断是否已存在此用户
    await usersDB.exist([data.username])
    .then(exist=>{
        // 不存在则注册
        if(exist.length === 0){
            usersDB.register([data.username,data.password])
            .then(result=>{
                if(result.affectedRows !== 1){
                    res.send({
                        code: "-2",//返回信息
                        error: "注册用户失败，请联系管理员"
                    })
                }else{
                    res.send({
                        ActionType: "OK",
                        code: "0",//返回信息，
                        msg:"success"
                    })
                }
            }).catch(err => {
                res.send({
                    code: '-2',
                    error: err
                })
              })
        }else{
            res.send({
                code: "-2",
                error: "用户名已存在"
            })
        }
    }).catch(err => {
        res.send({
            code: '-2',
            error: err
        })
      })
}

exports.updatePWD = async (req,res)=>{
    const data = req.body
    await usersDB.updatePWD([data.password,data.username])
    .then(result=>{
        if(result.affectedRows !== 1){
            res.send({
                code: "-2",//返回信息
                error: "修改密码失败，请联系管理员"
            })
        }else{
            res.send({
                ActionType: "OK",
                code: "0",//返回信息，
                msg:"success"
            })
        }
    }).catch(err => {
        res.send({
            code: '-2',
            error: err
        })
    })
}

exports.info = async (req,res)=>{
    const token = req.headers["authorization"].split(" ")[1]
    const payload = JWT.verify(token)
    const username = payload.username
    await usersDB.infoByName(username).then(result=>{
        res.send({
            ActionType: "OK",
            code: "0",//返回信息，
            data:result[0]
        })
    }).catch(err => {
        res.send({
            code: '-2',
            error: err
        })
    })
}
