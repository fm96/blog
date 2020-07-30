let mongoose=require('mongoose');
// const {post} =require('../controller/controllerUser');
// 创建视图
let catSchema=mongoose.Schema({
    username:String,
    title:String,
    desc:String,    
    pic:String,
    time:{
        type:Date,
        default:Date.now
    }
});

// 创建一个模型
let catmodel=mongoose.model('articles',catSchema);

// 封装查询方法
function find(select,options,sel,callback){
    catmodel.find(select,options,sel,(err,docs)=>{
        if(!err)
        {
           callback(null,docs);
        }else
        {
           callback(err);
        }
   
       })

}
// 封装id查询方法
function findById(id,callback){
    catmodel.findById(id,(err,docs)=>{
        if(!err)
        {
           callback(null,docs);
        }else
        {
           callback(err);
        }
   
       })

}

// 封装添加方法
function create(post,callback){
    catmodel.create(post,(err,docs)=>{
        if(!err){
            callback(null,docs);
        }else{
            callback(err);
        }
    });
}

// 暴露
module.exports={
    create,
    find,
    findById
}