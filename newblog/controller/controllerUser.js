let express = require('express');
let router = express.Router();
// 加载文件包
let formidable = require('formidable');
let fs = require('fs');
let timestamp = require('time-stamp');
let path = require('path');
// 加密密码
const crypto = require('crypto');
const key = 'kjfkjdfkjldkflsdks';

// 加载model层
let userModule = require('../model/userModel');
let articelModule = require('../model/articelModel');

// 判断是否登录
router.use((req, res, next) => {
    // 排除登录页和注册页
    if (req.url == '/login' || req.url == '/reg') {
        next();
    } else if (!req.session.username) {
        return res.render('tip.html', {
            wait: 2,
            content: '你未登录，请先登录',
            href: '/user/login'
        })
    } else {
        next();
    }
})



// 规划登录路由
router.get('/login', (req, res) => {
    res.render('user-login.html');
})

// 登录数据处理
router.post('/login', (req, res) => {
    // 获取表单提交数据
    let title = req.body;
    let {
        username,
        password
    } = title;
    // 密码MD5加密方式进行存储
    password = crypto.createHmac('sha256', key)
        .update(password).digest('hex');
    // 查询数据
    userModule.find({
        username
    }, {}, {}, (err, result) => {
        // console.log(result)
        if (!result.length) {
            return res.render('tip.html', {
                wait: 2,
                content: '用户名不存在，请先注册',
                href: '/user/reg'
            })
        }
        // console.log(password)
        if (password != result[0].password) {
            return res.render('tip.html', {
                wait: 2,
                content: '密码错误，请重新输入',
                href: '/user/login'
            })
        }
        // 使用session存储用户名
        req.session.username = username;
        return res.render('tip.html', {
            wait: 2,
            content: '登录成功',
            href: '/'
        })

    })
})

// 规划注册路由
router.get('/reg', (req, res) => {
    res.render('user-reg.html');
})

// 注册数据处理
router.post('/reg', (req, res) => {
    // 获取表单提交的数据
    /* let username=req.body.username;
    let sex=req.body.sex; */
    let title = req.body;
    let {
        username,
        password,
        sex
    } = title;
    // 密码MD5加密方式进行存储
    req.body.password = crypto.createHmac('sha256', key)
        .update(password).digest('hex');
    // console.log(password)
    // 查询所有数据
    userModule.find({
        username
    }, {}, {}, (err, result) => {
        // console.log(result)
        if (result.length) {
            return res.render('tip.html', {
                wait: 2,
                content: '用户名已存在，请登录',
                href: '/user/login'
            })
        }
        userModule.create(title, (err, result) => {
            if (err) {
                return res.render("tip", {
                    wait: "2",
                    content: "注册失败",
                    href: "/user/reg"
                })

            } else {
                return res.render("tip", {
                    wait: "2",
                    content: "注册成功",
                    href: "/user/login"
                })

            }
        })
    })

})

// 规划发表文章路由
router.get('/publish', (req, res) => {
    res.render('user-publish.html');
})
// 处理文章数据
router.post('/publish', (req, res) => {
    // 获取表单数据
    
    // 获取上传内容
    let form = new formidable.IncomingForm();
    // 跨磁盘操作
    form.uploadDir = path.normalize(__dirname + '../../static');
    // console.log(path.normalize(__dirname+'../../static'))
    form.parse(req, (err, fields, files) => {
        // console.log(files)
        let uplodfile = files.file;
        // 上传图片，重命名：时间+随机数+后缀名
        let extname = path.extname(uplodfile.name);
        let rd = parseInt(Math.random() * 8999 + 10000);
        let time = timestamp('YYYYMMDD');
        // 获取原来的路径
        let oldpath = uplodfile.path;
        // 规划新路径
        let newpath = path.normalize(__dirname + '../../upload/' + time + rd + extname);
        // console.log(newpath);
        // 文件名
        let pathname = time + rd + extname;
        fields.pic = pathname;
        fields.username = req.session.username;
        // console.log(fields)
        fs.rename(oldpath, newpath, (err) => {
            if (!err) {
                // 添加进数据库
                articelModule.create(fields, (err, result) => {
                    if (err) {
                        return res.render("tip", {
                            wait: "2",
                            content: "发布失败",
                            href: "/user/publish"
                        })

                    } else {
                        return res.render("tip", {
                            wait: "2",
                            content: "发布成功",
                            href: "/"
                        })

                    }
                })

            } else {
                console.log(err)
            }
        })


    })
})

// 暴露
module.exports = router;