// receive message from content.js(in object req)
browser.runtime.onMessage.addListener((req) => {
	console.log(JSON.parse(req.info))
	navigator.clipboard.writeText(req.info)
})
