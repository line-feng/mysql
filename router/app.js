const routerList = require('./hellowRoutre.js')

let router = {
	routerList
}

const routerData = {
	routerInit: (app) => {
		let init = new Promise((resolve, reject) => {
			for (let i in router) {
				router[i].init = (app) => {
					router[i].app = app
				}
				router[i].init(app)
				routerData[i] = router[i]
			}
			resolve(routerData)
		})
		return init
	}
}

module.exports = routerData