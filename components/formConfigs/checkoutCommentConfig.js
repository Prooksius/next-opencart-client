import { REACT_APP_IMAGE_URL } from 'config'

export const checkoutCommentFormData = {
	fields: {
		comment: {
			label: 'CheckoutComment',
			value: '',
			type: 'textarea',
			validations: {
				maxLength: 1000,
			},
			errorMessage: '',
			dirty: false,
		},
	},
}
