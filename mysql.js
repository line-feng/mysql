const mysql = require("mysql");

const databases = {
	mysqlInit: () => {
		const db_config = {
			host: "43.128.47.111",//服务器ip/本地ip  主要看数据库在本地还是在服务器
			user: "root",//账号
			password: "Linefengfy@163.com",//密码
			port: "3306",//数据库端口
			database: "comic",//需要连接的数据库 也可不填选择自己处理
			
		}
		this.connect = mysql.createConnection(db_config);
		this.connect.connect(function(err) {
			if (err) {
				console.log('err')
			} else {
				console.log('ok')
			}
		})
	},
	controlTable: (sql, inser = null) => {
		let tableData = new Promise((resolve, reject) => {
			try{
				this.connect.query(sql, inser, (err, result)=> {
					if (err) throw err;
					console.log(sql + " success");
					resolve(result)
				})
			}catch(e){
				resolve(400)
			}
		})
		return tableData
	}
}



module.exports = databases
