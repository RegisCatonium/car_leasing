document.addEventListener('DOMContentLoaded', function() {

	const inputPrice = document.querySelector('#input-price'),
			inputDownPayment = document.querySelector('#input-downpayment'),
			outputDownPayment = document.querySelector('#output-downpayment'),
			inputTerm = document.querySelector('#input-term'),
			form = document.querySelector('#form'),
			outputMonthsPayment = document.querySelector('#months-payment'),
			totalCost = document.querySelector('#total-cost')

	const maxPrice = 6000000,
			minPrice = 1000000

	// опции форматирования
	const cleaveSetting = {
		numeral: true,
		numeralThousandsGroupStyle: 'thousand',
		delimiter: ' ',
		numeralDecimalScale: 0
	}
	const cleaveSettingRUB = {
		numeral: true,
		numeralThousandsGroupStyle: 'thousand',
		delimiter: ' ',
		prefix: ' ₽',
		tailPrefix: true,
		numeralDecimalScale: 0
	}

	// запуск форматирования

	const cleavePrice = new Cleave(inputPrice, cleaveSetting)
	const cleaveDownPayment = new Cleave(inputDownPayment, cleaveSetting)
	const cleaveTerm = new Cleave(inputTerm, cleaveSetting)

	// отображение и рассчет
	calcLeasing()
	form.addEventListener('input', calcLeasing)

	function calcLeasing() {

		let price = +cleavePrice.getRawValue() // стоимость авто
		if (price > maxPrice) {price = maxPrice}
		if (price < minPrice) {price = minPrice}

		let downPaymentPrec = inputDownPayment.value / 100 // первонач. взнос
		if (downPaymentPrec > 0.6) {downPaymentPrec = 0.6}
		if (downPaymentPrec < 0.1) {downPaymentPrec = 0.1}

		let months = +inputTerm.value // срок в месяцах
		if (months > 60) {months = 60}
		if (months < 1) {months = 1}

		const downPayment = price * downPaymentPrec // первонач. взнос
		const monthPayment = (price - downPayment) * ((0.035 * Math.pow((1 + 0.035), months)) / (Math.pow((1 + 0.035), months) - 1)) // ежемесячный
		const totalAmount = downPayment + months * monthPayment // сумма договора лизинга

		// выводим результат в html
		totalCost.innerText = totalAmount
		outputDownPayment.innerText = downPayment
		outputMonthsPayment.innerText = monthPayment
		new Cleave(totalCost, cleaveSettingRUB)
		new Cleave(outputDownPayment, cleaveSettingRUB)
		new Cleave(outputMonthsPayment, cleaveSettingRUB)
	}

	// ползунок
	const sliderPrice = document.getElementById('slider-price')
	const sliderPercent = document.getElementById('slider-percent')
	const sliderTerm = document.getElementById('slider-term')

	noUiSlider.create(sliderPrice, {
		 start: 3300000,
		 connect: 'lower',
		//  tooltips: true,
		 step: 1000,
		 range: {
			  'min': minPrice,
			  'max': maxPrice
		 }
	})
	noUiSlider.create(sliderPercent, {
		 start: 13,
		 connect: 'lower',
		//  tooltips: true,
		 step: 1,
		 range: {
			  'min': 10,
			  'max': 60
		 }
	})
	noUiSlider.create(sliderTerm, {
		 start: 60,
		 connect: 'lower',
		//  tooltips: true,
		 step: 1,
		 range: {
			  'min': 1,
			  'max': 60
		 }
	})


	sliderPrice.noUiSlider.on('slide', function() {
		const sliderValue = parseInt(sliderPrice.noUiSlider.get(true))
		cleavePrice.setRawValue(sliderValue)
		calcLeasing()
	})
	sliderPercent.noUiSlider.on('slide', function() {
		const sliderValue = parseInt(sliderPercent.noUiSlider.get(true))
		cleaveDownPayment.setRawValue(sliderValue)
		calcLeasing()
	})

	sliderTerm.noUiSlider.on('slide', function() {
		const sliderValue = parseInt(sliderTerm.noUiSlider.get(true))
		cleaveTerm.setRawValue(sliderValue)
		calcLeasing()
	})


	// проверка на мин-мак значения
	inputPrice.addEventListener('input', () => {
		const value = +cleavePrice.getRawValue()
		sliderPrice.noUiSlider.set(value)

		if (value > maxPrice || value < minPrice) {
			inputPrice.closest('.calc__input').classList.add('calc__input_err')
		}
		else {
			inputPrice.closest('.calc__input').classList.remove('calc__input_err')
		}
	})

	inputPrice.addEventListener('change', () => {
		const value = +cleavePrice.getRawValue()

		if (value > maxPrice) {
			inputPrice.closest('.calc__input').classList.remove('calc__input_err')
			cleavePrice.setRawValue(maxPrice)
		}
		if (value < minPrice) {
			inputPrice.closest('.calc__input').classList.remove('calc__input_err')
			cleavePrice.setRawValue(minPrice)
		}
	})


	inputDownPayment.addEventListener('input', () => {
		const value = +inputDownPayment.value
		sliderPercent.noUiSlider.set(value)

		if (value > 60 || value < 10) {
			outputDownPayment.closest('.calc__input').classList.add('calc__input_err')
		}
		else {
			outputDownPayment.closest('.calc__input').classList.remove('calc__input_err')
		}
	})

	inputDownPayment.addEventListener('change', () => {
		const value = +inputDownPayment.value

		if (value > 60) {
			outputDownPayment.closest('.calc__input').classList.remove('calc__input_err')
			cleaveDownPayment.setRawValue(60)
		}
		if (value < 10) {
			outputDownPayment.closest('.calc__input').classList.remove('calc__input_err')
			cleaveDownPayment.setRawValue(10)
		}
	})
	
	inputTerm.addEventListener('input', () => {
		const value = +inputTerm.value
		sliderTerm.noUiSlider.set(value)

		if (value > 60 || value < 1) {
			inputTerm.closest('.calc__input').classList.add('calc__input_err')
		}
		else {
			inputTerm.closest('.calc__input').classList.remove('calc__input_err')
		}
	})

	inputTerm.addEventListener('change', () => {
		const value = +inputTerm.value

		if (value > 60) {
			inputTerm.closest('.calc__input').classList.remove('calc__input_err')
			cleaveTerm.setRawValue(60)
		}
		if (value < 1) {
			inputTerm.closest('.calc__input').classList.remove('calc__input_err')
			cleaveTerm.setRawValue(1)
		}
	})


	// отправка формы (не работает)
	const sendData = async (url, data) => {
		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
		})
		if (!response.ok) {
			throw new Error(`ошибка по адресу ${url}, статусошибки ${response}`)
		}
		return await response.json()
	}


	const sendForm = function() {

		// const data = {
		// 	name: 'имя',
		// 	count: 3
		// }
		form.addEventListener('submit', e => {
			e.preventDefault()
	
			let formData = new FormData(form)

			// const list = JSON.stringify(data)


			console.log(form)
			// console.log(JSON.stringify(form))
			console.log(formData)
			console.log(JSON.stringify(formData))
			// console.log(list)
	
			// const list = JSON.stringify(data)
			// sendData('https://jsonplaceholder.typicode.com/post', data)
			sendData('https://jsonplaceholder.typicode.com/posts', formData)
				// .then(() => {
				// 	form.reset()
				// })
		})
	}
	sendForm()








})