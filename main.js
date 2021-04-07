const express = require('express'),
	app = express()
    bodyParser = require('body-parser'),
	//mysql
	{
		mysqlInit, //初始化myql
		controlTable //控制mysql
	} = require('./mysql.js'),
	//api接口
	{
		routerInit
	} = require('./router/app.js');
	
//配置post 获取 body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mysqlInit()

routerInit(app).then(({
	routerList
}) => {
	for (let i in routerList) {
		typeof routerList[i] == 'function' && i != 'app' && i != 'init' ? routerList[i](controlTable) : ''
	}
})

app.listen(8888, (err) => {
	console.log('http://localhost:8888')
})
