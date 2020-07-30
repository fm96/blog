let express=require('express');
let router=express.Router();
let articelModule=require('../model/articelModel');

router.use((req,res,next)=>{
  
    next();
  })

// 规划首页路由
router.get('/',(req,res)=>{
    articelModule.find({},{},{limit:9,sort:{time:-1}},(err,result)=>{
        // console.log(result)
        res.render('index-index.html',{result:result});
    })
    
})

// 规划详情页
router.get('/blog/detail/:id',(req,res)=>{
    let id=req.params.id;
    console.log(id)
    articelModule.findById(id,(err,result)=>{
        // console.log(result)
        res.render('index-blog-detail.html',{result:result});
    })
    
})


// 暴露
module.exports=router;