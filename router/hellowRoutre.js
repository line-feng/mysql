const {
	validationToekn,
	serialize,
	Token,
	getSearch,
	getList,
	downloadImg,
	axios,
	chapterList,
	getomicView,
	micViewList
} = require('../util/index.js'),
	fs = require('fs');


const routerList = {
	//获取搜索列表保存至mysql以及图片文件
	getComic: (controlTable) => {
		routerList.app.get('/api/getComic', async (req, res) => {
			let title = req.query.searchValue
			let searchHtml = await getSearch(title)
			let comicData = getList(searchHtml)
			comicData.listComic.forEach((item) => {
				let url = item.url.split('/')
				url = url[url.length - 2]
				let imgUrl = '/images/' + url + '/' + url + '.jpg'
				downloadImg(item.imgSrc, url, url)
				controlTable('select title from comicList where title=?', [item.title]).then(result => {
					if (result.length == 0) {
						let addSql = 'INSERT INTO comicList(title,url,imgSrc,author,newPage) VALUES(?,?,?,?,?)';
						let addSqlParams = [item.title, item.url, imgUrl, item.author, item.newPage];
						controlTable(addSql, addSqlParams)
					} else {
						controlTable('update comicList set title=?,url=?,imgSrc=?,author=?,newPage=? where title=?', [item.title,
							item.url, imgUrl, item.author, item.newPage, item.title
						])
					}
				})

				controlTable('select comicId,title,url from comicList where title REGEXP  ?', [title]).then(result => {
					for (let i = 0; i < result.length; i++) {
						axios({
								url: 'http://192.168.1.14:8888/api/getDetails',
								method: 'get',
								data: {
									url: result[i].url,
									title: result[i].title,
									comicId: result[i].comicId
								}
							})
							.then(data => {
								// console.log(data)
							})
					}
				})

			})

			res.send('200')
		})
	},
	getDetails: (controlTable) => {
		routerList.app.get('/api/getDetails', async (req, res) => {
			let body = req.body

			let deailsHtml = await axios({
				url: body.url,
				method: 'get'
			})
			let comicData = chapterList(deailsHtml)

			comicData.listComic.splice(comicData.listComic.length - 1, 1)
			comicData.listComic.forEach((item, index) => {
				console.log(body.comicId, item.list_con_zj)
				return
				controlTable('select comicId,list_con_zj from comicDetails where id=?,list_con_zj=?', [body.comicId, item.list_con_zj
						.replace(' ', '-')
					])
					.then(result => {

						console.log(result)

						let addSql = 'INSERT INTO comicDetails(comicId,url,list_con_zj) VALUES(?,?,?)';
						let addSqlParams = [1, item.url, item.list_con_zj.replace(' ', '-')];
						// controlTable(addSql, addSqlParams)
					})
			})
			res.send({
				code: 200,
				data: comicData
			})
		})
	},
	getomicView: (controlTable) => {
		routerList.app.get('/api/getomicView', async (req, res) => {
			let list = await getomicView('https://m.qianwee.com/manhua/yuanlong/812037.html')
			list.forEach((item, index) => {
				fs.mkdir('images/yuanlong/2', async function(err) {
					(async function() {
						let html = await axios({
							url: item,
							method: 'get'
						})
						let {
							imgSrc
						} = micViewList(html)
						await downloadImg(imgSrc, 'yuanlong/2', (index + 1))
						console.log(index)
					})()
				})

			})
			res.send({
				code: 200,
				data: list
			})
		})

	}
}


module.exports = routerList

// controlTable(
// 					`CREATE TABLE comicList (
// 				comicId int not null auto_increment, 
// 				title VARCHAR(255), 
// 				url VARCHAR(255), 
// 				imgSrc VARCHAR(255), 
// 				author varchar(255),
// 				newPage varchar(255),
// 				primary key(comicId))`
// 				)
