import { REACT_APP_IMAGE_URL } from 'config'

export const checkoutPersonFormData = {
	fields: {
		name: {
			label: 'CheckoutPersonName',
			value: '',
			type: 'text',
			validations: {
				required: true,
				minLength: 5,
				maxLength: 255,
			},
			errorMessage: '',
			dirty: false,
		},
		email: {
			label: 'checkoutPersonEmail',
			value: '',
			type: 'text',
			validations: {
				required: true,
				email: true,
			},
			errorMessage: '',
			dirty: false,
		},
		phone: {
			label: 'checkoutPersonPhone',
			value: '',
			type: 'text',
			validations: {
				required: true,
				minLength: 5,
				maxLength: 100,
			},
			errorMessage: '',
			dirty: false,
		},
	},
}
