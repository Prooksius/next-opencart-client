import { REACT_APP_IMAGE_URL } from '../../config'

export const editProductFormData = {
	fields: {
		name: {
			label: 'Название товара',
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
		model: {
			label: 'Модель',
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
		sku: {
			label: 'Артикул',
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
		type: {
			label: 'Тип заметки',
			value: '',
			type: 'select',
			dropdown: 'images',
			options: [
				{
					value: 'chocolate',
					label: 'Chocolate',
					image: REACT_APP_IMAGE_URL + '/upload/img/banners/shokolad.jpg',
				},
				{
					value: 'strawberry',
					label: 'Strawberry',
					image:
						REACT_APP_IMAGE_URL + '/upload/img/banners/klubnika-26582668.jpg',
				},
				{
					value: 'vanilla',
					label: 'Vanilla',
					image:
						REACT_APP_IMAGE_URL + '/upload/img/banners/vanil-struchkovaya.jpg',
				},
			],
			validations: {
				required: true,
			},
			errorMessage: '',
			dirty: false,
		},
		description: {
			label: 'Описание',
			value: '',
			type: 'textarea',
			rows: 5,
			validations: {
				required: true,
				minLength: 10,
				maxLength: 1000,
			},
			errorMessage: '',
			dirty: false,
		},
	},
}
