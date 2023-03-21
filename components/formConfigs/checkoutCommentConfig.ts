import { MyFormData } from "../app/forms/formWrapper/types";

export const checkoutCommentFormData: MyFormData = {
	fields: {
		comment: {
			label: 'CheckoutComment',
			type: 'textarea',
			value: '',
			valueObj: { value: '', label: 'Не выбрано' },
			valueArr: [],
			validations: {
				maxLength: 1000,
			},
			errorMessage: '',
			dirty: false,
		},
	},
}
