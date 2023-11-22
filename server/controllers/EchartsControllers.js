const echartsDB = require('../models/EchartsModel')

exports.save = async (req, res) => {
    const data = req.body
    await echartsDB.exist([data.name])
        .then(exist => {
            // 不存在则新建
            if (exist.length === 0) {
                echartsDB.save([data.name, data.data_id, data.creator_id, data.code])
                    .then(result => {
                        res.send({
                            code: '1',
                            message: result
                        })
                    }).catch(err => {
                        res.send({
                            code: '-2',
                            error: err,
                            message:'请联系管理员'
                        })
                    })
            }else{
                res.send({
                    code: '-2',
                    error: '组件已存在'
                })
            }
        }).catch(err => {
            res.send({
                code: '-2',
                error: err,
                message:'请联系管理员'
            })
        })
}

exports.update = async (req, res) => {
    const data = req.body
    // 判断是否已存在此组件
    await echartsDB.update([data.code, data.name])
        .then(result => {
            if(result.length === 0){
                res.send({
                    code: '-2',
                    error: '组件不存在'
                })
            }else if (result.affectedRows !== 1) {
                res.send({
                    code: '-2',
                    error: '修改失败'
                })
            }else{
                res.send({
                    code: '1',
                    message: '修改成功'
                })
            }
            
        }).catch(err => {
            res.send({
                code: '-2',
                message:'请联系管理员'
            })
            console.log(err)
        })
}

exports.show = async (req, res) => {
    const data = req.body
    await echartsDB.show([data.name])
        .then(result => {
            if(result.length === 0){
                res.send({
                    code: '-2',
                    error: '组件不存在'
                })
            }else{
                res.send({
                    code: '1',
                    message: result
                })
            }
        }).catch(err => {
            res.send({
                code: '-2',
                message:'请联系管理员'
            })
            console.log(err)
        })
}

exports.delete = async (req, res) => {
    const data = req.body
    // 判断是否已存在此组件
    await echartsDB.delete([data.name])
        .then(result => {
            if(result.length === 0){
                res.send({
                    code: '-2',
                    error: '组件不存在'
                })
            }else if (result.affectedRows !== 1) {
                res.send({
                    code: '-2',
                    error: '删除失败'
                })
            }else{
                res.send({
                    code: '1',
                    message: '删除成功'
                })
            }
        }).catch(err => {
            res.send({
                code: '-2',
                message:'请联系管理员'
            })
            console.log(err)
        })
            
}