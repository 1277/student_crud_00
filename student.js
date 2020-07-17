/*
	student持久化模块
*/
var fs = require('fs');
const dbPath = './json/student.json';
/**
 * 查询所有学生
 * */
module.exports.find = (callback) => {
	//为了可以处理到读取错误，我们使用fs.readFile来读取json文件
	//readFile的第二个参数是以什么方式解码读取的数据，这样就不用处理二进制格式的data了。
	fs.readFile(dbPath, 'utf8', function(err, data) {
		if (err) {
			callback(err);
			return;
		}
		var obj = JSON.parse(data);
		callback(null, obj);
	})
}
/**
 * 添加一个学生
 * */
module.exports.add = (studentObj, callback) => {
	fs.readFile(dbPath, 'utf8', (err, data) => {
		if (err) {
			callback(err);
			return;
		}
		var obj = JSON.parse(data);
		//生成插入数据的id，算法为最大id数+1
		if (obj.students.length === 0) {
			studentObj.id = 1;
		} else {
			let arr = [];
			obj.students.forEach((element) => {
				arr.push(element.id);
			});
			arr.sort((a, b) => {
				return b - a
			});
			studentObj.id = arr[0] + 1;

		}



		//对表单获取的数据进行二次处理以符合json文件的格式要求。
		studentObj.gender = parseInt(studentObj.gender);
		studentObj.age = parseInt(studentObj.age);
		studentObj.hobbies = studentObj.hobbies.split(',');


		obj.students.push(studentObj);
		var jsonstr = JSON.stringify(obj);
		fs.writeFile(dbPath, jsonstr, (err) => {
			if (err) {
				callback(err);
				return;
			}
			//回调方法得调用一次，否则其因为一直不会调用
			//就无法触发res.redirect
			callback(null);
		});
	});
}
/**
 * 根据id查询一个学生
 * */
module.exports.findById = (id, callback) => {
	fs.readFile(dbPath, 'utf8', (err, data) => {
		if (err) {
			callback(err);
		}
		var students = JSON.parse(data).students;
		var student = students.find(element => {
			return element.id === parseInt(id) ? true : false;
		});
		//for debug
		console.log(student);


		callback(null, student);

	})
}
/**
 * 更新指定学生
 * */
module.exports.update = (student, callback) => {
	if (student.id == null) {
		callback({
			e_msg: "student没有id，不知道更新哪个"
		});
		return;
	}
	fs.readFile(dbPath, 'utf8', (err, studentJson) => {
		if (err) {
			callback(err);
			return;
		}
		student.id = parseInt(student.id);
		var studentJsonObj = JSON.parse(studentJson);
		var students = studentJsonObj.students;
		var old_stuObj = students.find(element => {
			return element.id === student.id ? true : false;
		});
		if (old_stuObj == null) {
			callback({
				e_msg: "找不到指定sutdent，可能出现脏数据"
			});
			return;
		}
		student.hobbies = student.hobbies.split(',');
		//替换
		students.splice(students.indexOf(old_stuObj), 1, student);
		fs.writeFile(dbPath, JSON.stringify(studentJsonObj), (err) => {
			if (err) {
				callback(err);
				return;
			}
			callback(null);
		});
	});
}
/**
 * 删除一个学生
 * */
module.exports.remove = (id, callback) => {
	fs.readFile(dbPath, 'utf8', (err, studentJson) => {
		if (err) {
			callback(err);
			return;
		}
		var studentJsonObj = JSON.parse(studentJson);
		var students = studentJsonObj.students;
		var student = students.find(element => {
			return element.id === parseInt(id) ? true : false;
		});
		if (!student) {
			callback({
				e_msg: "找不到对应的id"
			});
			return;
		}
		students.splice(students.indexOf(student), 1);
		//for debug
		console.log(students);
		fs.writeFile(dbPath, JSON.stringify(studentJsonObj), (err) => {
			if (err) {
				callback(err);
			}
			callback(null);
		});

	});
}
