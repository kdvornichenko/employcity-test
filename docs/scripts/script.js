import { schemeData } from './scheme.data.js'
import { formSelectData } from './formSelect.data.js'

function createSchemeItem(item) {
	const schemeItem = `
    <div class="ordering__scheme-item">
      <div class="img-holder">
        <img src="${item.icon}" alt="Icon" />
				</div>
      <p class="text">${item.text}</p>
    </div>
  `
	return schemeItem
}

const orderingScheme = document.querySelector('.ordering__scheme')

const dots = document.querySelector('.dots')
schemeData.forEach((item, index) => {
	const schemeItem = createSchemeItem(item)
	orderingScheme.insertAdjacentHTML('beforeend', schemeItem)

	if (index < schemeData.length - 1) {
		const dotsItem = document.createElement('div')
		dotsItem.classList.add('dots__row')
		for (let i = 0; i < 5; i++) {
			const span = document.createElement('span')
			dotsItem.appendChild(span)
		}
		dots.appendChild(dotsItem)
	}
})

// Форма
const orderForm = document.querySelector('form#order-form')
const selectBox = orderForm.querySelector('.select-box')
const selected = selectBox.querySelector('.selected')
const optionsContainer = selectBox.querySelector('.options__wrap')

// Генерация опций на основе данных из formSelectData
formSelectData.forEach((option, index) => {
	const label = createFormSelectItem(option.label, index + 1)
	optionsContainer.insertAdjacentHTML('beforeend', label)
})

// Передача значений в .selected элемент
optionsContainer.querySelectorAll('input[type="radio"]').forEach((input) => {
	input.addEventListener('change', () => {
		// убираем атрибут checked у всех радио-кнопок, кроме текущей
		optionsContainer
			.querySelectorAll('input[type="radio"]')
			.forEach((otherInput) => {
				if (otherInput !== input) {
					otherInput.checked = false
				}
			})
		selected.innerHTML = input.nextElementSibling.innerHTML
		selectBox.classList.remove('active')
	})
})

function createFormSelectItem(label, index) {
	const selectItem = `
    <label>
			<input type="radio" name="option_${index}" value=${index} />
			<span>${label}</span>
		</label>
  `
	return selectItem
}

selected.addEventListener('click', () => {
	selectBox.classList.toggle('active')
})

const rangeBox = orderForm.querySelector('.range-box')
const progress = rangeBox.querySelector('.range-box__progress-value')
const range = rangeBox.querySelector('#range')

function getRangeValue() {
	progress.innerHTML = range.value + '%'
}

getRangeValue()

range.addEventListener('input', getRangeValue)


