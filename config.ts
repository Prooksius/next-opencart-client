import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const QUANTITY_LIMIT = 99999
export const PRODUCTS_LIMIT = 12
export const ARTICLES_LIMIT = 6
//export const REACT_MAIN_URL = 'https://next-cart.proksi-design.ru/'
//export const REACT_APP_DB_URL = 'https://next-cart.proksi-design.ru/api/v1'
//export const REACT_APP_IMAGE_URL = 'https://next-cart.proksi-design.ru'
export const REACT_MAIN_URL = 'http://next-cart.site/'
export const REACT_APP_DB_URL = 'http://next-cart.site/api/v1'
export const REACT_APP_IMAGE_URL = 'http://next-cart.site'

let lastId = 0

export const getNewID = (prefix = 'element-id') => {
	lastId++
	return `${prefix}${lastId}`
}

export const getRandomCode = (size: number) => {
	if (!size) size = 1
	let num = Math.floor(Math.random() * 1000000).toString()
	while (num.length < size) num = '0' + num
	return num
}

interface TYmapSettings {
	lang?: 'tr_TR' | 'en_US' | 'en_RU' | 'ru_RU' | 'ru_UA' | 'uk_UA'
	apikey?: string
	coordorder?: 'latlong' | 'longlat'
	load?: string
	mode?: 'release' | 'debug'
	csp?: boolean
	ns?: string
}

export const ymapSettings: TYmapSettings = {
	apikey: '2315e588-5f6f-41c2-a457-f10e0739712a',
	lang: 'ru_RU',
	coordorder: 'latlong',
}
export const optionsWithValue = ['text', 'textarea', 'date', 'datetime', 'time']

export const serializeObj = (obj: Record<string, any>) =>
	Object.keys(obj)
		.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
		.join('&')

/**
 * Displays toaster
 * @param {String} title
 * @param {String} type
 */
export function toastAlert(title: string, type: string = 'info') {
	if (type === 'info') {
		toast.info(title)
	} else if (type === 'warning') {
		toast.warning(title)
	} else if (type === 'error') {
		toast.error(title)
	} else if (type === 'success') {
		toast.success(title)
	}

	/*
  MySwal.fire({
    toast: true,
    position: "top-right",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    icon: type,
    title: title,
  });
  */
}
// export function confirmationAlert(title, confirmButtonText, cancelButtonText) {
// 	return MySwal.fire({
// 		title,
// 		icon: 'warning',
// 		showCloseButton: true,
// 		showCancelButton: true,
// 		focusConfirm: false,
// 		confirmButtonText,
// 		cancelButtonText,
// 	})
// }

export function pluralType(n: number, lang = 'ru-RU'): number {
	if (lang === 'ru-RU') {
		return n % 10 == 1 && n % 100 != 11
			? 0
			: n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
			? 1
			: 2
	} else {
		return n === 1 ? 0 : 1
	}
}
export function pluralName(n: number, lang = 'ru-RU'): number {
	if (lang === 'ru-RU') {
		return n % 10 == 1 && n % 100 != 11 ? 0 : 1
	} else {
		return 0
	}
}

export function chooseValueText(lang = 'ru-RU') {
	if (lang === 'ru-RU') {
		return 'Выберите значение'
	} else {
		return 'Choose value'
	}
}

/**
 * Calculate brightness value by RGB or HEX color.
 * @param color (String) The color value in RGB or HEX (for example: #000000 || #000 || rgb(0,0,0) || rgba(0,0,0,0))
 * @returns (Number) The brightness value (dark) 0 ... 255 (light)
 */
export function brightnessByColor(color1: string) {
	const color = '' + color1,
		isHEX = color.indexOf('#') == 0,
		isRGB = color.indexOf('rgb') == 0

	let r: string | undefined = undefined
	let g: string | undefined = undefined
	let b: string | undefined = undefined

	if (isHEX) {
		const hasFullSpec = color.length == 7
		const m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g)
		if (m) {
			r = m[0] + (hasFullSpec ? '' : m[0])
			g = m[1] + (hasFullSpec ? '' : m[1])
			b = m[2] + (hasFullSpec ? '' : m[2])
		}
	}
	if (isRGB) {
		var m = color.match(/(\d+){3}/g)
		if (m) {
			r = m[0]
			g = m[1]
			b = m[2]
		}
	}
	if (
		typeof r != 'undefined' &&
		typeof b != 'undefined' &&
		typeof g != 'undefined'
	)
		return (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000
}

export function numberFormat(
	number: number,
	decimals: number,
	dec_point: string,
	thousands_sep: string
) {
	// Strip all characters but numerical ones.
	const number1 = (number + '').replace(/[^0-9+\-Ee.]/g, '')
	var n = !isFinite(+number1) ? 0 : +number1,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
		dec = typeof dec_point === 'undefined' ? '.' : dec_point,
		s = '',
		toFixedFix = function (n: number, prec: number) {
			const k = Math.pow(10, prec)
			return '' + Math.round(n * k) / k
		}
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	const s1 = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
	if (s1[0].length > 3) {
		s1[0] = s1[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
	}
	if ((s1[1] || '').length < prec) {
		s1[1] = s1[1] || ''
		s1[1] += new Array(prec - s1[1].length + 1).join('0')
	}
	return s1.join(dec)
}

export function strippedContent(string: string) {
	return string.replace(/<\/?[^>]+>/gi, '')
}
