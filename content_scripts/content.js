const agentSources = [
	{ agentName: 'jielv', domain: 'ebooking.jladmin.cn' },
	{ agentName: 'kingsley', domain: 'www.ql-gz.com/ebooking' },
	{ agentName: 'ctrip', domain: 'ebooking.ctrip.com' },
	{ agentName: 'meituan', domain: 'eb.meituan.com' },
	{ agentName: 'fliggy', domain: 'hotel.fliggy.com' },
	// { agentName: '微信商城', domain: 'ebooking.jladmin.cn' },
	{ agentName: 'email', domain: 'mail.qiye.163.com' },
]

browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
	// console.log(req.msg)
	const url = req.url
	let curAgent = ''
	for (const agent of agentSources) {
		if (url.indexOf(agent.domain) !== -1) {
			curAgent = agent.agentName
		}
	}
	switch (curAgent) {
		case 'jielv':
			browser.runtime.sendMessage({ info: Jielv() })
			break
		case 'kingsley':
			browser.runtime.sendMessage({ info: Kingsley() })
			break
		case 'meituan':
			browser.runtime.sendMessage({ info: Meituan() })
			break
		case 'ctrip':
			browser.runtime.sendMessage({ info: Ctrip() })
			break
		case 'fliggy':
			browser.runtime.sendMessage({ info: Fliggy() })
			break
		case 'email':
			emailBookings()
			break
	}
})
