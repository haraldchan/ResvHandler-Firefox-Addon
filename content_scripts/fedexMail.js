function FedexMail() {
	const infoObj = { identifier: 'ReservationHandler', agent: 'fedex' }
	const resvTypeText = document.querySelectorAll('h2')[1].childNodes[4].textContent.trim()
	infoObj.resvType = resvTypeText.includes('ADD') ? 'ADD' : 'CHANGE'
	const flightInfoTable = document.querySelectorAll('div tbody')[2].children
	const newResv = flightInfoTable[flightInfoTable.length - 1].children
	// console.log(newResv)
	let col = infoObj.resvType === 'ADD' ? 0 : 1
	infoObj.roomQty = Number(newResv[col].innerText)
	const roomRatePerNight = parseFloat(newResv[col + 1].innerText) * 1.15
	infoObj.flightIn = newResv[col + 2].innerText.replace(' ', '')
	infoObj.flightOut = newResv[col + 5].innerText.replace(' ', '')

	infoObj.ciDate = parseDateString(newResv[col + 3].innerText)[0]
	infoObj.ETA = parseDateString(newResv[col + 3].innerText)[1]

	infoObj.coDate = parseDateString(newResv[col + 4].innerText)[0]
	infoObj.ETD = parseDateString(newResv[col + 4].innerText)[1]

	infoObj.stayHours = getStayHours(infoObj.ciDate, infoObj.ETA, infoObj.coDate, infoObj.ETD)
	infoObj.daysActual = getDaysActual(infoObj.stayHours)
	infoObj.roomRates = Array(infoObj.daysActual).fill(roomRatePerNight)

	const crewInfo = document.querySelector('div .content')
	infoObj.crewNames = getCrewNames(crewInfo.innerText.split('\n')[0])
	const tripNum = crewInfo.parentElement.nextElementSibling.textContent.split(' ')
	infoObj.tripNum = `${tripNum[5]}/${tripNum[7]}`
	infoObj.tracking = Array.from(document.querySelectorAll('p')).pop().innerText.split(' ').pop()

	return JSON.stringify(infoObj)
}

function parseDateString(input) {
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

	const [date, time, meridian] = input.split(' ')
	const year = `20${date.slice(-2)}`
	const month = monthMap[date.slice(2, 5)]
	const day = date.slice(0, 2)
	const formattedDate = `${year}${month}${day}`

	let formattedTime = ''
	const [h, m] = time.split(':')
	if (h === '12') {
		const newH = meridian === 'AM' ? '00' : '12'
		formattedTime = newH + ':' + m
	} else if (meridian === 'AM') {
		formattedTime = time
	} else {
		const newH = Number(h) + 12
		formattedTime = newH + ':' + m
	}

	return [formattedDate, formattedTime]
}

function getStayHours(inboundDate, inboundTime, outboundDate, outboundTime) {
	const dateString1 = inboundDate + inboundTime.replace(':', '')
	const dateString2 = outboundDate + outboundTime.replace(':', '')

	const date1 = new Date(
		parseInt(dateString1.slice(0, 4), 10),
		parseInt(dateString1.slice(4, 6), 10) - 1,
		parseInt(dateString1.slice(6, 8), 10),
		parseInt(dateString1.slice(8, 10), 10),
		parseInt(dateString1.slice(10, 12), 10)
	)

	const date2 = new Date(
		parseInt(dateString2.slice(0, 4), 10),
		parseInt(dateString2.slice(4, 6), 10) - 1,
		parseInt(dateString2.slice(6, 8), 10),
		parseInt(dateString2.slice(8, 10), 10),
		parseInt(dateString2.slice(10, 12), 10)
	)

	const timeDifference = date2.getTime() - date1.getTime()
	const hours = Math.floor(timeDifference / (1000 * 60 * 60))
	const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
	const formattedHours = hours < 10 ? `0${hours}` : hours.toString()
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString()
	return `${formattedHours}:${formattedMinutes}`
}

function getDaysActual(hoursAtHotel) {
	const [h, m] = hoursAtHotel.split(':')
	if (h < 24) {
		return 1
	} else if (h % 24 === 0 && m === '00') {
		return parseInt(h / 24)
	} else if (h >= 24 || m !== '00') {
		return parseInt(h / 24 + 1)
	}
}

function getCrewNames(crewInfo) {
	if (crewInfo.includes(',')){
		const crewMembers = crewInfo.split(',')
		return [
			crewMembers[0].split('(')[0].split('-')[1].trim(),
			crewMembers[1].split('(')[0].split('-')[1].trim()
		]
	} else {
		return [crewInfo.split('(')[0].split('-')[1].trim()]
	}
}