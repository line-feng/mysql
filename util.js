//创建表
//忽视controlTable函数  重要的是参数
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

//倒叙dasc 正序asc

//清空表 重置主键 重置递增
// truncate table 表名;

//向已经建好的表中插入新的属性
// controlTable('alter table content add  column createTime varchar(45) not null after content')


// var sql = "CREATE TABLE test (id int not null auto_increment, name VARCHAR(255), age INT(3), city VARCHAR(255),primary key(id))";
// connect.query(sql, function(err, result) {
// 	if (err) throw err;
// 	console.log("Table created");
// });

//插入数据
// let imgUrl = '/images/' + url + '/' + url + '.jpg'
// let addSql = 'INSERT INTO comicList(title,url,imgSrc,author,newPage) VALUES(?,?,?,?,?)';
// let addSqlParams = [item.title, item.url, imgUrl, item.author, item.newPage];
// controlTable(addSql, addSqlParams)

//根据条件删除数据
// connect.query('delete from test where id=1',(err,result) =>{
// 	if(!err){
// 		console.log(err)
// 	}
// 	console.log(result)
// })

//根据条件改变数据
// connect.query('update test set age=77 where id=3',(err,result) =>{
// 	if(!err){
// 		console.log(err)
// 	}
// 	console.log(result)
// })

//根据条件查询数据
// connect.query('select id from test',(err,result) =>{
// 	if(!err){
// 		console.log(err)
// 	}
// 	console.log(result)
// })

//两张表联合查询 返回user表的username和id 返回content表的content 查询条件user.id == content.id 根据content.createTime 作为排序条件（倒叙） 如果存在时间相同则使用id排序 返回最大五条数据
// controlTable(
// 	'select user.id,user.username,content.content,content.createTime from user,content where user.id = content.id order by createTime desc,id desc limit 5'
// ).then(data => {
// 	res.send({
// 		code: 200,
// 		data: data
// 	})
// })
