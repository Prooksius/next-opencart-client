import validator from 'validator'

export const required = ({ value }) => {
	if (!value.toString().trim().length) {
		return 'Value cannot be empty'
	} else return false
}
export const minLength = ({ param, value }) => {
	if (value.toString().trim().length < +param) {
		return `Value must be more than ${param} characters`
	} else return false
}
export const maxLength = ({ param, value }) => {
	if (value.toString().trim().length > +param) {
		return `Value must be less than ${param} characters`
	} else return false
}
export const minValue = ({ param, value }) => {
	if (parseFloat(String(value)) <= parseFloat(String(param))) {
		return `Value must be more than ${param}`
	} else return false
}
export const maxValue = ({ param, value }) => {
	if (value.toString().trim().length >= +param) {
		return `Value must be less than ${param}`
	} else return false
}

export const email = ({ value }) => {
	if (!validator.isEmail(String(value))) {
		return `Value must be email`
	} else return false
}

export const isNumeric = ({ value }) => {
	if (!validator.isNumeric(String(value))) {
		return `Value must be number`
	} else return false
}

export const isAlpha = ({ value }) => {
	if (!validator.isAlpha(String(value))) {
		return `Value must be only letters`
	} else return false
}

export const isAlphanumeric = ({ value }) => {
	if (!validator.isAlphanumeric(String(value))) {
		return `Value must be only letters and numbers`
	} else return false
}

export const sameAs = ({ value, param, fields }) => {
	if (!fields || !fields[param]) return false
	if (!validator.equals(String(value), fields[param].value)) {
		return `Value must be equal to ${fields[param].label} field`
	} else return false
}
