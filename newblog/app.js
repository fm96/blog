// 加载框架
let express=require('express');
let app=express();
let path=require('path');

// 初始化数据库
require('./libs/connect');

// 加载模板引擎
let ejs=require('ejs');
// 配置模板引擎
app.set('view engine','html');
app.set('views',__dirname+'/view');
// 加载静态资源
app.use('/assets',express.static(path.resolve('./assets')));
// 加载404资源文件
app.use(express.static(__dirname+'/404'));
// 加载上传的文件
app.use('/upload',express.static(path.resolve('./upload')));
console.log(path.resolve('./upload'))
// 保留html
app.engine('html',ejs.__express);

// 获取表单数据
let bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));

//加载cookie-session
let cookiesession = require("cookie-session");

app.use(cookiesession({
 name:"sessionId",//session的编号
 keys:["asdasfd",["wqerty"]]
}))

// 首页
let routerIndex=require('./controller/controllerIndex');
app.use(routerIndex);


// 登录
let routerUser=require('./controller/controllerUser');
app.use('/user',routerUser);




// 加载404页面
app.use((req,res,next)=>{
    res.render('404.html');
})
// 监听端口
app.listen(3000);