import {
	SET_FIELD,
	SET_FORM,
	CLEAR_FORM,
	CHECK_FORM,
	CHECK_FIELD,
	ERROR_FIELD,
	FieldData,
	FieldsData,
	FormField,
	MyFormData,
	ValidationsData,
	ActionType,
	SelectValue,
	NS,
	ErrorPayloadData,
} from './types'
import {
	ValidatorProps,
	maxLength,
	minLength,
	maxValue,
	minValue,
	required,
	email,
	sameAs,
	isNumeric,
	isAlpha,
	isDate,
	isAlphanumeric,
	isIP,
	dateInFuture,
} from './myValidators'

type FormPayload = {
	fields?: FieldsData
	field?: string
	value?: string | NS | SelectValue
	index?: number
	errorData?: ErrorPayloadData
}

type FormAction = {
	type: ActionType
	payload?: FormPayload
}

// В функции валидатора:
//  - первый параметр - параметр валидатора (например в случае minLength(5) - это 5)
//  - второй параметр - значение текущего поля
//  - третий параметр - все поля формы
type FormValidFunc = (
	param: boolean | number | string,
	value: string,
	fields?: FieldsData,
	otherField?: string
) => string | boolean

type FormValidHandlers = {
	[key: string]: FormValidFunc
}

type DefaultFunc = (state: MyFormData) => MyFormData
type FormHandlerFunc = (state: MyFormData, action: FormAction) => MyFormData | null
type FieldHandlerFunc = (state: MyFormData, action: FormAction) => MyFormData

type FormHandlers = {
	[SET_FORM]: FormHandlerFunc
	[CHECK_FORM]: FormHandlerFunc
	[CLEAR_FORM]: DefaultFunc
	[SET_FIELD]: FieldHandlerFunc
	[CHECK_FIELD]: FieldHandlerFunc
	[ERROR_FIELD]: FieldHandlerFunc
	DEFAULT: DefaultFunc
}

// Массив валидаторов, ссылающихся на другие поля формы
const connectedFields = ['sameAs']

const validateHandlers: FormValidHandlers = {
	required: (param, value, fields) =>
		required({ value, param: param ? true : false }),
	minLength: (param, value, fields) => minLength({ value, param }),
	maxLength: (param, value, fields) => maxLength({ value, param }),
	minValue: (param, value, fields) => minValue({ value, param }),
	maxValue: (param, value, fields) => maxValue({ value, param }),
	email: (param, value, fields) => email({ value, param }),
	isNumber: (param, value, fields) => isNumeric({ value, param }),
	isIP: (param, value, fields) => isIP({ value, param }),
	isAlpha: (param, value, fields) => isAlpha({ value, param }),
	isDate: (param, value, fields) => isDate({ value, param }),
	isAlphanumeric: (param, value, fields) => isAlphanumeric({ value, param }),
	dateInFuture: (param, value, fields) => dateInFuture({ value, param }),
	sameAs: (param, value, fields, otherField) =>
		sameAs({
			value,
			param: otherField ? otherField : '',
			fields: fields ? fields : {},
		}),
}

const handlers: FormHandlers = {
	[SET_FORM]: (state, { payload }) => payload ? payload : null,
	[SET_FIELD]: (state, { payload }) => {
		const copyState = Object.assign({}, state)

		if (
			Object.keys(copyState.fields ? copyState.fields : []).includes(
				payload?.field ? payload?.field : ''
			)
		) {
			const field =
				copyState.fields && payload?.field
					? copyState.fields[payload.field]
					: null

			if (field && payload) {
				if (typeof payload.value === 'string') {
					field.value = payload.value
				} else if (typeof payload.value === 'object') {
					if (typeof payload.index === 'number') {
						field.valueArr[payload.index] = <NS>payload.value
					} else {
						field.valueObj = <SelectValue>payload.value
					}
				} else if (typeof payload.value === 'undefined') {
					if (typeof payload.index === 'number') {
						field.valueArr = field.valueArr.filter(
							(_, index) => index !== payload.index
						)
					} else if (typeof payload.index === 'undefined') {
						field.valueArr = []
					}
				}

				const validations = field.validations
				if (Object.keys(validations).length) {
					field.errorMessage = ''
					field.dirty = true
					Object.entries(validations).every(([key, value]) => {
						let fieldValue = ''
						if (['text', 'email', 'radio', 'checkbox'].includes(field.type)) {
							fieldValue = String(payload.value)
						} else if (field.type === 'select') {
							fieldValue = (<SelectValue>payload.value).value
						} else if (field.type === 'array') {
							fieldValue = String(field.valueArr.length)
						} else if (field.type === 'checklist') {
							fieldValue = String(
								field.valueArr.filter((valueItem) => (<NS>valueItem).checked)
									.length
							)
						}
						let invalid: string | boolean = false

						if (key in validateHandlers) {
							// В вызове функции валидатора:
							//  - первый параметр - параметр валидатора (например в случае minLength(5) - это 5)
							//  - второй параметр - значение текущего поля
							//  - третий параметр - все поля формы
							invalid = validateHandlers[key](
								value,
								fieldValue,
								copyState.fields,
								String(value)
							)
							if (connectedFields.includes(key)) {
								handlers[CHECK_FIELD](state, {
									type: CHECK_FIELD,
									payload: { field: String(value) },
								})
							}
						}

						if (invalid) {
							if (typeof invalid === 'string') field.errorMessage = invalid
							return false
						}
						return true
					})
				} else {
					field.errorMessage = ''
					field.dirty = true
				}
			}
		}
		return copyState
	},
	[CHECK_FIELD]: (state, { payload }) => {
		const copyState = Object.assign({}, state)

		if (Object.keys(copyState.fields ? copyState.fields : []).includes(payload?.field ? payload.field : '')) {
			const field =
				copyState.fields && payload?.field
					? copyState.fields[payload.field]
					: null

			if (field) {
				const validations = field.validations
				if (Object.keys(validations).length) {
					field.errorMessage = ''
					field.dirty = true
					Object.entries(validations).every(([key, value]) => {
						let fieldValue = ''
						if (['text', 'email', 'radio', 'checkbox'].includes(field.type)) {
							fieldValue = field.value
						} else if (field.type === 'select') {
							fieldValue = field.valueObj.value
						} else if (field.type === 'array') {
							fieldValue = String(field.valueArr.length)
						} else if (field.type === 'checklist') {
							fieldValue = String(
								field.valueArr.filter((valueItem) => (<NS>valueItem).checked)
									.length
							)
						}
						let invalid: string | boolean = false

						if (key in validateHandlers) {
							// В вызове функции валидатора:
							//  - первый параметр - параметр валидатора (например в случае minLength(5) - это 5)
							//  - второй параметр - значение текущего поля
							//  - третий параметр - все поля формы
							invalid = validateHandlers[key](
								value,
								fieldValue,
								copyState.fields,
								String(value)
							)
						}

						if (invalid) {
							if (typeof invalid === 'string') field.errorMessage = invalid
							return false
						}
						return true
					})
				}
			}
		}
		return copyState
	},
	[ERROR_FIELD]: (state, { payload }) => {
		const copyState = Object.assign({}, state)

		if (payload?.errorData) {
			if (typeof payload.errorData.detail !== 'string') {
				payload.errorData.detail.map((error) => {
					let field_name = '-'
					if (error.loc.length) {
						field_name = error.loc[error.loc.length - 1]
					}
					if (Object.keys(copyState.fields ? copyState.fields : []).includes(field_name)) {
						const field = copyState.fields ? copyState.fields[field_name] : null
						if (field) {
							field.errorMessage = error.msg
						}
					}
				})
			}
		}
		return copyState
	},
	[CHECK_FORM]: (state) => {
		const copyState = Object.assign({}, state)

		const fields = copyState.fields
		//console.log("Object.entries(fields)", Object.entries(fields))

		Object.entries(fields ? fields : []).every(([key2, field]) => {
			const validations = field.validations
			//console.log("validations", key, validations)
			if (Object.keys(validations).length) {
				field.errorMessage = ''
				field.dirty = true
				Object.entries(field.validations).every(([key, value]) => {
					let fieldValue = ''
					if (['text', 'email', 'radio', 'checkbox'].includes(field.type)) {
						fieldValue = field.value
					} else if (field.type === 'select') {
						fieldValue = field.valueObj.value
					} else if (field.type === 'array') {
						fieldValue = String(field.valueArr.length)
					} else if (field.type === 'checklist') {
						fieldValue = String(
							field.valueArr.filter((valueItem) => (<NS>valueItem).checked)
								.length
						)
					}
					let invalid: string | boolean = false

					if (key in validateHandlers) {
						invalid = validateHandlers[key](
							value,
							fieldValue,
							fields,
							String(value)
						)
					}

					if (invalid) {
						if (typeof invalid === 'string') field.errorMessage = invalid
						return false
					}
					return true
				})
			}
			return true
		})
		return copyState
	},
	[CLEAR_FORM]: (state) => {
		const copyState = Object.assign({}, state)

		Object.entries(copyState.fields ? copyState.fields : []).every(([key, field]) => {
			if (['text', 'email', 'radio', 'checkbox'].includes(field.type)) {
				field.value = ''
			} else if (field.type === 'select') {
				field.valueObj = { value: '', label: 'Не выбрано' }
			} else if (['array', 'checklist'].includes(field.type)) {
				field.valueArr = []
			}
		})
		return copyState
	},
	DEFAULT: (state) => state,
}

export const formWrapperReducer = (state: MyFormData, action: FormAction) => {
	//  console.log('state', state)
	//  console.log('action', action)
	const handle = handlers[action.type] || handlers.DEFAULT
	const newState = handle(state, action)
	return newState ? newState : state
}
