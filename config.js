import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const QUANTITY_LIMIT = 99999
export const PRODUCTS_LIMIT = 12
export const ARTICLES_LIMIT = 6
//export const REACT_MAIN_URL = 'http://prooksid.beget.tech/'
//export const REACT_APP_DB_URL = 'http://prooksid.beget.tech/api/v1'
//export const REACT_APP_IMAGE_URL = 'http://prooksid.beget.tech'
export const REACT_MAIN_URL = 'https://next-cart.proksi-design.ru/'
export const REACT_APP_DB_URL = 'https://next-cart.proksi-design.ru/api/v1'
export const REACT_APP_IMAGE_URL = 'https://next-cart.proksi-design.ru'

export const ymapSettings = {
	apikey: '2315e588-5f6f-41c2-a457-f10e0739712a',
	lang: 'ru_RU',
	coordorder: 'latlong',
	version: '2.1',
}
export const optionsWithValue = ['text', 'textarea', 'date', 'datetime', 'time']

export const serializeObj = (obj) =>
	Object.keys(obj)
		.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
		.join('&')

/**
 * Displays toaster
 * @param {String} title
 * @param {String} type
 */
export function toastAlert(title, type = 'info') {
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
export function confirmationAlert(title, confirmButtonText, cancelButtonText) {
	return MySwal.fire({
		title,
		icon: 'warning',
		showCloseButton: true,
		showCancelButton: true,
		focusConfirm: false,
		confirmButtonText,
		cancelButtonText,
	})
}

export function pluralType(n, lang) {
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
export function pluralName(n, lang) {
	if (lang === 'ru-RU') {
		return n % 10 == 1 && n % 100 != 11 ? 0 : 1
	} else {
		return 0
	}
}
export function chooseValueText(lang) {
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
export function brightnessByColor(color) {
	var color = '' + color,
		isHEX = color.indexOf('#') == 0,
		isRGB = color.indexOf('rgb') == 0
	if (isHEX) {
		const hasFullSpec = color.length == 7
		var m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g)
		if (m)
			var r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16),
				g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16),
				b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16)
	}
	if (isRGB) {
		var m = color.match(/(\d+){3}/g)
		if (m)
			var r = m[0],
				g = m[1],
				b = m[2]
	}
	if (typeof r != 'undefined') return (r * 299 + g * 587 + b * 114) / 1000
}

export function numberFormat(number, decimals, dec_point, thousands_sep) {
	// Strip all characters but numerical ones.
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
		dec = typeof dec_point === 'undefined' ? '.' : dec_point,
		s = '',
		toFixedFix = function (n, prec) {
			var k = Math.pow(10, prec)
			return '' + Math.round(n * k) / k
		}
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || ''
		s[1] += new Array(prec - s[1].length + 1).join('0')
	}
	return s.join(dec)
}

export function strippedContent(string) {
	return string.replace(/<\/?[^>]+>/gi, '')
}
