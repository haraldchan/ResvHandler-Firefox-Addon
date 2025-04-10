const infoObjFormat = [
	'bbf', //Number[]
	'roomType', //string
	'orderId', //string
	'ciDate', //string, yyyyMMdd
	'coDate', //string, yyyyMMdd
	'guestNames', //String[]
	'remarks', //string
	'roomQty', //number
	'roomRates', //Number[]
	'roomType', //string
]
// query models
function Jielv() {
	const infoObj = { identifier: '031709eafc20ab898d6b9e9860d31966', agent: 'jielv' }
	const tdclass = document.querySelectorAll('.tdclass')
	infoObj.orderId = tdclass[0].nextElementSibling.innerText
	infoObj.roomType = tdclass[4].nextElementSibling.innerText.split(' ')[0]
	const guestNames = tdclass[6].nextElementSibling.innerText.split('/')
	guestNames.pop()
	infoObj.guestNames = guestNames
	infoObj.ciDate = tdclass[7].nextElementSibling.innerText.split('至')[0].replaceAll('-', '')
	infoObj.coDate = tdclass[7].nextElementSibling.innerText.split('至')[1].replaceAll('-', '')
	infoObj.remarks = tdclass[11].nextElementSibling.innerText

	const tabbles = document.querySelectorAll('.tabble-body')
	// roomQty
	infoObj.roomQty = Number(tabbles[0].children[4].innerText)
	// roomRate
	const roomRates = []
	const bbf = []
	for (const tabble of tabbles) {
		roomRates.push(Number(tabble.children[3].innerText.slice(0, -2)))
		const breakfast = tabble.children[1].innerText.split(' ')[1]
		if (breakfast === '不含早') {
			bbf.push(0)
		} else if (breakfast === '单早') {
			bbf.push(1)
		} else {
			bbf.push(2)
		}
	}
	roomRates.pop()
	bbf.pop()
	infoObj.roomRates = roomRates
	infoObj.bbf = bbf

	return JSON.stringify(infoObj)
}

function Kingsley() {
	const infoObj = { identifier: '031709eafc20ab898d6b9e9860d31966', agent: 'kingsley' }
	infoObj.orderId = document.querySelectorAll('.STYLE43')[3].nextSibling.textContent.trim()
	const guestNames = document.querySelectorAll('.square42')[1].innerText.trim()
	if (guestNames.includes('、')) {
		infoObj.guestNames = guestNames.split('、')
	} else if (guestNames.includes(',')) {
		infoObj.guestNames = guestNames.split(',')
	} else if (guestNames.includes('，')) {
		infoObj.guestNames = guestNames.split('，')
	} else {
		infoObj.guestNames = [guestNames]
	}
	const roomTypeText = Array.from(document.querySelectorAll('div')).filter(div => div.innerText === '房间种类：')[0].parentElement.nextElementSibling.innerText.trim()
	if (roomTypeText.includes('(')) {
		infoObj.roomType = roomTypeText.split('(')[0].trim()
	} else if (roomTypeText.includes('（')) {
		infoObj.roomType = roomTypeText.split('（')[0].trim()
	} else {
		infoObj.roomType = roomTypeText.trim()
	}

	const orderIdText = document.querySelectorAll('.square426')[1].innerText
	const bbfCount = orderIdText.includes('不含早') ? 0 : orderIdText.includes('单早') ? 1 : 2

	const stayTable = document.querySelectorAll('table')[2].children[0]
	infoObj.ciDate = stayTable.children[1].children[0].textContent.trim().replace(/[^0-9]/gi, '')
	infoObj.coDate = stayTable.children[stayTable.childElementCount - 1].children[1].textContent.trim().replace(/[^0-9]/gi, '')
	infoObj.bbf = Array(dateDiffInDays(infoObj.ciDate, infoObj.coDate)).fill(bbfCount)
	infoObj.roomQty = Number(stayTable.children[1].children[2].textContent)

	const rateInfoText = document.querySelectorAll('table')[3].children[0].children[0].children[0].textContent.split('：')[2].split('，房价请向客人保密')[0]
	function roomNightSplitter(rateInfoText) {
		const rate = Number(rateInfoText.split('晚)')[1].replace(/[^0-9]/gi, ''))
		const nts = parseInt(rateInfoText.split('晚)')[0].split('(')[1])
		return Array(nts).fill(rate)
	}
	if (rateInfoText.includes('，')) {
		// more than one rate
		const rateInfoArray = rateInfoText.split('，')
		infoObj.roomRates = rateInfoArray.map((rateText) => roomNightSplitter(rateText)).flat()
	} else {
		// single rate
		infoObj.roomRates = roomNightSplitter(rateInfoText)
	}
	infoObj.remarks = document.querySelectorAll('table')[3].children[0].children[0].children[0].textContent.split('：')[2].split('，房价请向客人保密。')[1]

	return JSON.stringify(infoObj)
}

function Meituan() {
	const infoObj = { identifier: '031709eafc20ab898d6b9e9860d31966', agent: 'meituan' }
	const infoItems = document.querySelectorAll('.detail-info-item')
	infoObj.orderId = infoItems[0].children[1].innerText.split(' ')[0]
	guestNames = infoItems[3].innerText.split('\n')[1]
	if (guestNames.includes('、')) {
		infoObj.guestNames = guestNames.split('、')
	} else {
		infoObj.guestNames = [guestNames]
	}

	const roomCharIndex = infoItems[5].innerText.split('\n')[1].indexOf('房')
	infoObj.roomType = infoItems[5].innerText.split('\n')[1].slice(0, roomCharIndex + 1)
	infoObj.roomQty = Number(infoItems[5].children[1].children[0].innerText.slice(0, 1))

	const stay = infoItems[6].children[1].childNodes[0].nodeValue
	infoObj.ciDate = stay.split('至')[0].trim().replaceAll('-', '')
	infoObj.coDate = stay.split('至')[1].trim().replaceAll('-', '')

	const roomRates = []
	const roomRateNodeList = document.querySelectorAll('.detail-info-wrap .text-danger')
	for (const rate of roomRateNodeList) {
		roomRates.push(Number(rate.innerText.slice(1)).toFixed(2))
	}
	roomRates.shift()
	infoObj.roomRates = roomRates

	const bbf = []
	const bbfNodeList = document.querySelectorAll('.detail-info-wrap .ml-20')
	for (const breakfast of bbfNodeList) {
		if (breakfast.innerText === '不含早') {
			bbf.push(0)
		} else if (breakfast.innerText === '单早') {
			bbf.push(1)
		} else {
			bbf.push(2)
		}
	}
	infoObj.bbf = bbf

	return JSON.stringify(infoObj)
}

function Ctrip() {
	const infoObj = { identifier: '031709eafc20ab898d6b9e9860d31966', agent: 'ctrip' }
	infoObj.orderId = parseInt(document.getElementById('lblOrderID').innerText)
	const tableOrderList = document.querySelectorAll('.table-order-list span')
	// console.log(tableOrderList);
	infoObj.guestNames = tableOrderList[2].firstChild.textContent.trim().split(',')
	infoObj.ciDate = tableOrderList[3].firstChild.textContent.split('-')[0].trim().replaceAll('/', '')
	infoObj.coDate = tableOrderList[3].firstChild.textContent.split('-')[1].trim().replaceAll('/', '')
	const roomCharIndex = tableOrderList[4].firstChild.textContent.indexOf('房')
	infoObj.roomType = tableOrderList[4].firstChild.textContent.slice(0, roomCharIndex + 1)
	infoObj.roomQty = Number(tableOrderList[4].nextElementSibling.innerText)

	roomRateText = tableOrderList[6].innerText.split('\n')
	const roomRates = roomRateText.map((text) => parseFloat(text.split('CNY')[1]))
	roomRates.pop()
	infoObj.roomRates = roomRates
	const bbf = roomRateText.map((text) => (text.slice(-2) === '无早' ? 0 : Number(text.slice(-4).slice(0, 1))))
	bbf.pop()
	infoObj.bbf = bbf
	if (tableOrderList[7].innerText.includes('现付') !== -1) {
		infoObj.payment = '现付'
	} else {
		infoObj.payment = '预付'
	}
	infoObj.remarks = document.getElementById('lblRemark').innerText.replaceAll('\n', '。')

	return JSON.stringify(infoObj)
}

function Fliggy() {
	const infoObj = { identifier: '031709eafc20ab898d6b9e9860d31966', agent: 'fliggy' }
	infoObj.orderId = Number(document.querySelector('.ant-space-item').innerText)
	infoObj.guestNames = document.querySelector('.name___1TOpi').innerText.split(' ')

	const productInfo = document.querySelector('.line___3G3zu')
	infoObj.roomType = productInfo.innerText.split('-')[0]
	infoObj.roomQty = Number(productInfo.innerText.split('\n')[1].split('间')[0])
	if (productInfo.innerText.includes('+')) {
		const benefits = productInfo.innerText
			.split(' ')[0]
			.split('+')
			.filter((item) => !item.includes('早') && !item.includes('房'))
		infoObj.remarks = benefits.join(', ')
	} else {
		infoObj.remarks = ''
	}

	const stay = document.querySelectorAll('.line___3G3zu')[1].innerText.split('\n')[0].split('-')
	infoObj.ciDate = stay[0].replaceAll('/', '')
	infoObj.coDate = stay[1].replaceAll('/', '')

	infoObj.roomRates = Array.from(document.querySelectorAll('.red')).map((item) => Number(item.innerText.split(' ')[1]))
	const bbf = Array.from(document.querySelectorAll('.tableCellLabel___2hgxe')).map((item) => item.nextElementSibling.innerText)
	infoObj.bbf = bbf.map((item) => (item === '无早' ? 0 : item === '含单早' ? 1 : 2))

	infoObj.invoiceMemo = Array.from(document.querySelectorAll('.ant-descriptions-item-content span')).at(-2).innerText

	const paymentType = Array.from(document.querySelectorAll('.ant-descriptions-item-content span')).at(-1).innerText
	infoObj.payment = paymentType.includes('信用住') ? '信用住' : '预付'

	return JSON.stringify(infoObj)
}

function emailBookings() {
	const isFedex = document.querySelector('h2')?.textContent.includes('FedEx') ?? null
	const isAgoda = document.getElementById('imgAgodaLogo') ?? null
	const isWebbeds = document.body.innerText.includes('WebBeds FZ LLC') ?? null
	if (isFedex) {
		browser.runtime.sendMessage({ info: FedexMail() })
	} else if (isAgoda) {
		browser.runtime.sendMessage({ info: AgodaMail() })
	} else if (isWebbeds) {
		browser.runtime.sendMessage({ info: WebbedsMail() })
	}
}

function AgodaMail() {
	const infoObj = { identifier: '031709eafc20ab898d6b9e9860d31966', agent: 'agoda' }
	infoObj.orderId = document.getElementById('ltrBookingIDValue').innerText
	infoObj.guestLastName = document.getElementById('ltrCustomerLastNameValue').innerText
	infoObj.guestFirstName = document.getElementById('ltrCustomerFirstNameValue').innerText

	function reformatDate(dateString) {
		const [day, month, year] = dateString.split(' ')[1].replace('(', '').replace(')', '').split('-')
		newDay = day < 10 ? '0' + day : day
		return `${year}${month}${newDay}`
	}
	infoObj.ciDate = reformatDate(document.getElementById('lblCustomerArrival').innerText)
	infoObj.coDate = reformatDate(document.getElementById('lblCustomerDeparture').innerText)

	infoObj.roomType = document.getElementById('lblRoomTypeData_lblMain').innerText
	infoObj.roomQty = Number(document.getElementById('lblNumberRoomsData_lblMain').innerText)
	const bbfText = document.getElementById('lblOfferText').innerText
	const bbfCount = bbfText.includes('Room Only') ? 0 : bbfText.includes('2') ? 2 : 1
	infoObj.bbf = Array(dateDiffInDays(infoObj.ciDate, infoObj.coDate)).fill(bbfCount)

	const roomRates = Array.from(document.querySelectorAll('.rates')).slice(0, -5)
	infoObj.roomRates = roomRates.map((td) => parseFloat(td.innerText.replace(',', '').split(' ')[1]).toFixed(2))

	infoObj.remarks = document.getElementById('lblSupplierNoteData')?.innerText
	infoObj.contacts = {
		phone: document.getElementById('lbl_CustomerInfoName_lblSub')?.innerText.split('电话: ')[1],
		email: document.getElementById('lbl_CustomerEmailInfo')?.innerText,
	}

	return JSON.stringify(infoObj)
}

function WebbedsMail() {
	const infoObj = { identifier: '031709eafc20ab898d6b9e9860d31966', agent: 'webbeds' }
	infoObj.orderId = getNextFieldInnerText('td', 'Booking Reference No', '*')
	const guestNames = getNextFieldInnerText('td', 'Passenger Name').split('Sir/Madam')[1].split(',')[0].trim()
	infoObj.guestNames = [guestNames]

	const monthMap = {
		Jan: '01',
		Feb: '02',
		Mar: '03',
		Apr: '04',
		May: '05',
		Jun: '06',
		Jul: '07',
		Aug: '08',
		Sep: '09',
		Oct: '10',
		Nov: '11',
		Dec: '12',
	}
	const ciDate = getNextFieldInnerText('td', 'Check-in').split(', ')[1].split(' ')
	infoObj.ciDate = ciDate[2] + monthMap[ciDate[1]] + ciDate[0]
	const coDate = getNextFieldInnerText('td', 'Check-out').split(', ')[1].split(' ')
	infoObj.coDate = coDate[2] + monthMap[coDate[1]] + coDate[0]

	infoObj.roomType = getNextFieldInnerText('td', 'Room Type')
	const breakfastQty =
		getNextFieldInnerText('td', 'Rate Basis') === 'Room Only' ? 0 : getNextFieldInnerText('td', 'Room Occupancy').charAt(0) === '2' ? 2 : 1

	infoObj.remarks = getNextFieldInnerText('td', 'Additional Requests')

	const creditCardInfos = Array.from(document.querySelectorAll('td')).filter((td) => td.innerText === 'Card Number')
	infoObj.creditCardNumbers = creditCardInfos.map((td) => td.parentElement.nextElementSibling.children[0].innerText)
	infoObj.creditCardExp = creditCardInfos.map((td) => td.parentElement.nextElementSibling.children[2].innerText)
	infoObj.roomQty = infoObj.creditCardNumbers.length

	const rateInfoNodes = Array.from(document.querySelectorAll('td')).filter((td) => td.innerText === 'CNY 0.00')
	infoObj.roomRates = rateInfoNodes
		.map((element) => Number(element.previousElementSibling.innerText.replace('CNY ','').replace(',','')))
		.splice(0, rateInfoNodes.length / infoObj.roomQty)
	infoObj.bbf = Array(infoObj.roomRates.length).fill(breakfastQty)

	return JSON.stringify(infoObj)
}

function dateDiffInDays(date1, date2) {
	const year1 = parseInt(date1.slice(0, 4), 10)
	const month1 = parseInt(date1.slice(4, 6), 10) - 1
	const day1 = parseInt(date1.slice(6, 8), 10)

	const year2 = parseInt(date2.slice(0, 4), 10)
	const month2 = parseInt(date2.slice(4, 6), 10) - 1
	const day2 = parseInt(date2.slice(6, 8), 10)

	const firstDate = new Date(year1, month1, day1)
	const secondDate = new Date(year2, month2, day2)

	const timeDifference = secondDate.getTime() - firstDate.getTime()

	const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24))

	return daysDifference
}

function getNextFieldInnerText(tag, searchInnerText, index = 0) {
	const tags = Array.from(document.querySelectorAll(tag))
	if (index !== '*'){
		return tags.filter((element) => element.innerText === searchInnerText)[index].nextElementSibling.innerText
	} else {
		const nodeArray = tags.filter((element) => element.innerText === searchInnerText)
		return nodeArray.map(element => element.nextElementSibling.innerText)
	}
}
