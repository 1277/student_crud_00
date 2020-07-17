/*
	程序入口模块
*/
var express=require('express');
var bodyParser=require('body-parser');
var router=require('./router');
var port='8009';

var app=express();
app.listen(port,()=>{
	console.log(`成功启动服务器，端口号为${port}`);
});
app.engine('html',require('express-art-template'));
app.set('views','./view/')

app.use(bodyParser.urlencoded({extended:false}));
app.use('/public/',express.static('./public/'));
app.use('/node_modules',express.static('./node_modules'));

//加载路由模块
app.use(router);

module.exports=app;




