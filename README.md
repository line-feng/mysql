#mysql 配置
在mysql.js中db_config对象配置数据库相关

#router
app.js 为 路由总集合
所有路由文件导入app.js 并将变量放置在 router 对象中 即可完成路由配置

#main.js
main.js为入口文件 导入mysql配置 以及路由配置

将控制mysql的函数传递过去即可在路由中控制mysql



##controlTable控制写法
//网mysql中插入数据
// var addSql = 'INSERT INTO test(username,age,password,phone,email) VALUES(?,?,?,?,?)';
// var addSqlParams = ['line', 1, '123456', '17674017907', 'linefengfy@163.com'];
// controlTable(addSql, addSqlParams)


//创建表 primary key(设为主键)
//auto_increment 设置自增

// controlTable(
// 		`CREATE TABLE test (
// 	id int not null auto_increment, 
// 	username VARCHAR(255), 
// 	age INT(3), 
// 	password VARCHAR(255), 
// 	phone varchar(255),
// 	email varchar(255),
// 	primary key(id))`
// 	)

//删除查询到的数据
// controlTable('delete from test where id=1')

//查询id=3的数据并将它的age改为77
// controlTable('update test set age=77 where id=2')

//查询test表中所有的ID
// controlTable('select id from test').then(rel => {
// 	console.log(rel)
// })






## /api/registered
# 注册 post
JSON传参
{
    "username":"",
    "password":""
}

## /api/login
# 登录 post
JSON传参
{
    "username":"",
    "password":""
}

## /api/key
# 发送 get
query传参
/api/key?conten=

[](http://43.128.47.111:8888)