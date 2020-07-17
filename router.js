/*
	路由设计模块
*/
var express = require('express');
var router = express.Router();
var student = require('./student');

/**
 * 渲染首页
 * */
router.get('/students', (req, res) => {
	student.find((err, data) => {
		if (err) {
			res.status(500).send('Server err');
		}
		res.render('student_list.html', data);
	});
});
/**
 * 渲染新增学生页面
 * */
router.get('/students/new', (req, res) => {
	res.render('student_edit.html', {
		opr: "add"
	});
});
/**
 * 进行添加操作
 * */
router.post('/students/new', (req, res) => {
	var studentObj = req.body;
	//for debug
	console.log(studentObj);
	student.add(studentObj, (err) => {
		if (err) {
			res.status(500).send('Server err');
		}
		res.redirect('/students');
	});
});
/**
 * 渲染编辑操作页面
 * */
router.get('/students/edit', (req,res) => {
	var id=req.query.id;
	student.findById(id,(err,data)=>{
		if(err){
			res.status(500).send('Server err');
		}
		if(data.hobbies){
			data.hobbies=data.hobbies.join(',');
		}
		res.render('student_edit.html',{
			opr:"update",
			student:data
		});
	});
});
/**
 * 更新渲染页面
 * */
 router.post('/students/edit',(req,res)=>{
	 var studentObj=req.body;
	 student.update(studentObj,(err)=>{
		 if(err){
			 res.status(500).send('Server err');
		 }
		 res.redirect('/students');
	 });
 });
 /**
  * 进行删除
  * */
 router.get('/students/delete',(req,res)=>{
	 var id=req.query.id;
	 student.remove(id,(err)=>{
		 if(err){
			 res.status(500).send('Server err');
		 }
		 res.redirect('/students');
	 });
 });



module.exports = router;
