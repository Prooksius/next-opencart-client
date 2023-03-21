import { MyFormData } from '../app/forms/formWrapper/types'

export const checkoutPersonFormData: MyFormData = {
	fields: {
		first_name: {
			label: 'CheckoutPersonFirstName',
			type: 'text',
			value: '',
			valueObj: { value: '', label: 'Не выбрано' },
			valueArr: [],
			validations: {
				required: true,
				minLength: 5,
				maxLength: 255,
			},
			errorMessage: '',
			dirty: false,
		},
		last_name: {
			label: 'CheckoutPersonLastName',
			type: 'text',
			value: '',
			valueObj: { value: '', label: 'Не выбрано' },
			valueArr: [],
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
			type: 'text',
			value: '',
			valueObj: { value: '', label: 'Не выбрано' },
			valueArr: [],
			validations: {
				required: true,
				email: true,
			},
			errorMessage: '',
			dirty: false,
		},
		phone: {
			label: 'checkoutPersonPhone',
			type: 'text',
			value: '',
			valueObj: { value: '', label: 'Не выбрано' },
			valueArr: [],
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
