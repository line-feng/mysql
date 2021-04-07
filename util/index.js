const axios = require('axios'),
	jsdom = require('jsdom'),
	cors = require('cors'),
	{
		JSDOM
	} = jsdom,
	bodyParser = require('body-parser'),
	request = require('request'),
	jwt = require('jsonwebtoken'),
	fs = require('fs');

let util = {
	validationToekn: (req) => {
		let valToken = new Promise((resolve, reject) => {
			let token;
			req.headers.cookie = req.headers.cookie ? req.headers.cookie : '';
			if (req.headers.cookie == '') {
				resolve(false)
			}
			req.headers.cookie.split(';').forEach(item => {
				item = item.split('=')
				if (item[0] == 'LINEFENG') {
					token = item[1]
					try {
						let data = jwt.verify(token, 'token');
						resolve(data)
					} catch (e) {
						resolve(false)
					}
				}
			})
		})
		return valToken
	},
	serialize: (name, val, opt) => {
		var pairs = [name + '=' + val];
		opt = opt || {};
		if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
		if (opt.domain) pairs.push('Domain=' + opt.domain);
		if (opt.path) pairs.push('Path=' + opt.path);
		if (opt.expires) pairs.push('Expires=' + opt.exppires.toUTCString());
		if (opt.httpOnly) pairs.push('HttpOnly');
		if (opt.secure) pairs.push('Secure');
		return pairs.join(';');
	},
	Token: {
		encrypt: function(data, time) { //data加密数据，time过期时间
			return jwt.sign(data, 'token', {
				expiresIn: time
			})
		},
		decrypt: function(token) {
			try {
				let data = jwt.verify(token, 'token');
				return {
					token: true,
					id: data.id
				};
			} catch (e) {
				return {
					token: false,
					data: e
				}
			}
		}
	},
	//获取搜索内容
	getSearch: async function getSearch(searchValue) {
		let data = await axios({
			url: 'https://qianwee.com/search/?keywords=' + encodeURIComponent(searchValue),
			method: 'get'
		})
		return data.data
	},
	//获取列表内容
	getList: function getList(html) {
		let comicData = {
			listNum: '',
			listComic: []
		}
		dom = new JSDOM(html);
		// 获取列表
		comicData.listNum = dom.window.document.querySelector(".comi_num .c_6").textContent //数量
		let listComic = dom.window.document.querySelectorAll(".list-comic") //获取总列表
		listComic.forEach((item) => {
			let listData = {}
			let listDom = new JSDOM(item.innerHTML);
			listData.url = listDom.window.document.querySelector("a").getAttribute('href')
			listData.url = listData.url.replace('www.', 'm.')
			listData.title = listDom.window.document.querySelector("a").getAttribute('title')
			listData.imgSrc = listDom.window.document.querySelector("img").getAttribute('src')
			listData.author = listDom.window.document.querySelector(".auth").textContent
			listData.newPage = listDom.window.document.querySelector(".newPage").textContent
			comicData.listComic.push(listData)
		})
		return comicData
	},
	downloadImg: function downloadImg(url, filename, indexName) {
		fs.access('./images/', function(err) {
			if (err) {
				fs.mkdir('images', function(err) {})
			}
		})
		fs.access('./images/' + filename, function(error) {
			if (error) {
				fs.mkdir('images/' + filename, function(err) {
					if (!err) {
						addImg()
					}
				})
			} else {
				addImg()
			}
		})

		function addImg() {
			request(url).pipe(
				fs.createWriteStream(`./images/${filename}/${indexName}.jpg`).on('close', err => {
					if (!err) {
						console.log('写入成功')
					}
				})
			)
		}
	},
	axios: async function(options) {
		let data = await axios(options)
		return data.data
	},
	//获取章节
	chapterList: function chapterList(html) {
		// chapter-list-1
		let comicData = {
			listNum: '',
			listComic: []
		}
		let dom = new JSDOM(html);
		let listComic = dom.window.document.querySelectorAll("#chapter-list-1 li")
		listComic.forEach((item) => {
			let listData = {}
			let listDom = new JSDOM(item.innerHTML);
			listData.url = listDom.window.document.querySelector("a").getAttribute('href')
			listData.list_con_zj = listDom.window.document.querySelector("a span").textContent
			// console.log(item.innerHTML)
			comicData.listComic.push(listData)
		})
		return comicData
	},
	//获取每页
	getomicView: async function getomicView(startUrl) {
		let imgList = []
		await axios({
			url: startUrl,
			method: 'get'
		}).then((html) => {
			dom = new JSDOM(html.data);
			let contPage = dom.window.document.querySelector(".image-content p:last-child").textContent.split('/')
			console.log(html.data)
			contPage.splice(0, 1)
			contPage = contPage.join('')

			for (let i = 0; i < contPage; i++) {
				let arr = startUrl.split('.')
				if (i != 0) {
					arr[arr.length - 2] = arr[arr.length - 2] + '-' + (i + 1)
				}
				imgList.push(arr.join('.'))
			}
		})
		return imgList
	},
	//获取视图
	micViewList: function micViewList(html) {

		let comicData = {
			listNum: '',
			listComic: []
		}
		let listData = {}
		dom = new JSDOM(html);
		listData.imgSrc = dom.window.document.querySelector("#manga-image").getAttribute('src')
		return listData
	}

}

module.exports = util
