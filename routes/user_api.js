var express = require('express');
var router = express.Router();

var userModel = require('../models/users')
var goodsModel = require('../models/goods')
var commentsModel = require('../models/comments')

var TopClient = require('../sms_sdk/topClient').TopClient;
var client = new TopClient({
    'appkey': '23857185',
    'appsecret': '46ef27b2d553383ba4fdef1322a610fd',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});

let code = ''

//获取验证码
router.post('/checkcode',function(req,res){
    let phone = req.body.phone;
    code = Math.floor(Math.random() * (9999 - 1000));
    if(req.xhr || req.accepts('json,html')=='json'){
        userModel.find({phone:phone},function(err,users){
            if(users.length > 0){
                client.execute('alibaba.aliqin.fc.sms.num.send', {
                    'extend':'123456',
                    'sms_type':'normal',
                    'sms_free_sign_name':'ST二手交易',
                    'sms_param':'{\"code\":'+'\"' +code + '\"}',
                    'rec_num':req.body.phone,
                    'sms_template_code':'SMS_68230009'
                }, function(error, response) {
                    if (!error){
                        console.log(response)
                        res.send(200,{response})
                    }else {
                        console.log(error)
                        res.send(400,{error})
                    }
                })
            }else{
                console.log('注册验证码');
                client.execute('alibaba.aliqin.fc.sms.num.send', {
                    'extend':'123456',
                    'sms_type':'normal',
                    'sms_free_sign_name':'ST二手交易',
                    'sms_param':'{\"code\":'+'\"' +code + '\"}',
                    'rec_num':req.body.phone,
                    'sms_template_code':'SMS_68115022'
                }, function(error, response) {
                    if (!error){
                        console.log(response)
                        res.send(200,{response})
                    }else {
                        console.log(error)
                        res.send(400,{error})
                    }
                })
            }
        })   
    }else{
        res.send(400,{msg:'not JSON'})
    }
})

//登陆注册
router.post('/register',function(req,res){
    let phone = req.body.phone;
    let check_code = req.body.check_code;
    if(req.xhr || req.accepts('json,html')=='json'){
        //todo
        console.log(check_code,code);
        // if(check_code == code){
            if(check_code == '1234'){
                userModel.find({phone:phone},function(err,users){
                    if(users.length > 0){
                        res.send(200,{userInfo:users[0],changeCurrentView:'home'})
                    }else{
                        let Module = new userModel({
                            phone:phone
                        })
                        Module.save();
                    res.send(201,{userInfo:Module,changeCurrentView:'supplement'})
                    }
                })
        }else{
            res.send(400,{msg:'验证码不匹配'})
        }
    }else{
        res.send(400,{msg:'not JSON'})
    }
})

//补充、修改、完善用户信息
router.patch('/info',function(req,res){
    console.log(req.body);
    let {
        _id,
        username,
        sex,
        admission_time
    } = req.body
    if(req.xhr || req.accepts('json,html')=='json'){
        userModel.find({_id:_id},function(err,users){
            console.log(users);
            res.send(200,users)
        })
    }
})







//form 表单提交
// router.post('/',function(req,res){
//   console.log('Name(from querystring):'+req.body.name)
//   console.log('studentNum(from querystring):'+req.body.studentNum)
//   console.log('sex(from querystring):'+req.body.sex)
//   console.log('telephone(from querystring):'+req.body.telephone)
//   console.log('file:'+req.body.files);
//     userModel.find({telephone:req.body.telephone},function(err,user){
//         if(user.length > 0){
//             console.log(user.telephone);                
//             res.send(401,{error:
//                 {
//                     msg:'telephone 重复',
//                     userPhone:user.telephone,
//                     reqPhone:req.body.telephone
//                 }
//             })
//         }else{
//             //存数据
//             new userModel({
//                 name:req.body.name,
//                 studentNum:req.body.studentNum,
//                 sex:req.body.sex,
//                 telephone:req.body.telephone
//             }).save();
//             res.send({success:true})
//         }
//     });
// })

//ajax提交
// router.post('/',function(req,res){
//     console.log(req);
    // console.log('Name(from querystring):'+req.body.name)
    // console.log('studentNum(from querystring):'+req.body.studentNum)
    // console.log('sex(from querystring):'+req.body.sex)
    // console.log('telephone(from querystring):'+req.body.telephone)
    // if(req.xhr || req.accepts('json,html')=='json'){
    //     userModel.find({telephone:req.body.telephone},function(err,user){
    //         if(user.length > 0){
    //             console.log(user.telephone);                
    //             res.send(401,{error:
    //                 {
    //                     msg:'telephone 重复',
    //                     userPhone:user.telephone,
    //                     reqPhone:req.body.telephone
    //                 }
    //             })
    //         }else{
    //             //存数据
    //             new userModel({
    //                 name:req.body.name,
    //                 studentNum:req.body.studentNum,
    //                 sex:req.body.sex,
    //                 telephone:req.body.telephone
    //             }).save();
    //             res.send({success:true})
    //         }
    //     });
    // }else{
    //     res.send(400,{error:'error'})
    // }
// })

module.exports = router;