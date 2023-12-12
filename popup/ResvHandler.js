const agents = [
	{ agentName: '深圳捷旅', domain: 'ebooking.jladmin.cn', supt: '支持' },
	{ agentName: '美团酒店商家', domain: 'eb.meituan.com/ebooking', supt: '支持' },
	{ agentName: '广州奇利', domain: 'www.ql-gz.com/ebooking', supt: '支持' },
	{ agentName: '携程', domain: 'ebooking.ctrip.com', supt: '支持' },
	{ agentName: '飞猪', domain: 'hotel.fliggy.com', supt: '支持' },
	{ agentName: '网易邮箱', domain: 'mail.qiye.163.com', supt: '支持' },
]

const curSource = document.querySelector('.current-source')
const suptStatus = document.querySelector('.supt-status')
const getInfoBtn = document.querySelector('.get-info')

getInfoBtn.addEventListener('click', getResvInfo)

// send message to content.js
async function getResvInfo() {
	const tabs = await browser.tabs.query({ currentWindow: true, active: true })
	browser.tabs.sendMessage(tabs[0].id, {
		msg: 'Info Accquiring...',
		url: tabs[0].url,
	})
		alert('已复制订单信息。')
}

async function showSiteInformation() {
	const tabs = await browser.tabs.query({ currentWindow: true, active: true })
	const url = tabs[0].url

	for (const agent of agents) {
		if (url.includes(agent.domain)) {
			curSource.innerText = agent.agentName
			if (!url.toLowerCase().includes('print') && !url.includes('THotelOrderformShowDpAct') && !url.includes('readhtml')) {
				getInfoBtn.disabled = true
				suptStatus.className = 'supt-status warning'
				suptStatus.innerText = '非打印订单界面'
				return
			}
			if (agent.supt === '支持') {
				getInfoBtn.disabled = false
				suptStatus.className = 'supt-status success'
				suptStatus.innerText = agent.supt
				return
			}
			return
		} else {
			getInfoBtn.disabled = true
			curSource.innerText = '非可用网站'
			suptStatus.className = 'supt-status danger'
			suptStatus.innerText = '不支持'
		}
	}
}

showSiteInformation()
browser.tabs.executeScript({ file: '/content_scripts/content.js' })
