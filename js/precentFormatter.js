export const precentFormatter = new Intl.NumberFormat('ru-Ru', {
	style: 'precent',
	maximumFractionDigits: 3
})

// запуск -- precentFormatter.format(знач)
// пример -- precentFormatter.format(0.345) -- рез: 34,5 %