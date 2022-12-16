import React from 'react'
import FormWrapper from '@/components/app/forms/formWrapper/FormWrapper'
import { toastAlert } from 'config'
import { editProduct } from '@/store/slices/productsSlice'
import { useSelector, useDispatch } from 'react-redux'
import { FormWrapperState } from '@/components/app/forms/formWrapper/FormWrapperState'
import TextField from '@/components/app/forms/formFields/TextField'
import TextareaField from '@/components/app/forms/formFields/TextareaField'
import SelectField from '@/components/app/forms/formFields/SelectField'
import { editProductFormData } from '@/components/formConfigs/editProductConfig'

const formFields = {
	text: TextField,
	textarea: TextareaField,
	select: SelectField,
}

export const EditProductForm = ({ product, onDoneCallback }) => {
	const dispatch = useDispatch()

	const filledFormData = Object.assign({}, editProductFormData)
	if (product) {
		filledFormData.fields.name.value = product.name
		filledFormData.fields.model.value = product.model
		filledFormData.fields.sku.value = product.sku
		filledFormData.fields.description.value = product.description
	}
	const submitHandler = async (token, formData) => {
		try {
			await dispatch(editProduct({ ...formData.fields, token, id: product.id }))
			toastAlert('Товар был изменен', 'success')
		} catch (e) {
			toastAlert('Ошибка изменения товара: ' + e.message, 'error')
		}
	}

	const goFurther = (form) => {
		console.log('form', form)
		// дальнейшие действия после успешной отправки формы
		if (onDoneCallback)
			onDoneCallback({
				...product,
				name: form.fields.name.value,
				model: form.fields.model.value,
				sku: form.fields.sku.value,
				description: form.fields.description.value,
			})
	}
	//  useEffect(() => {})

	const formFieldRender = (type, name) => {
		const FormField = formFields[type]
		return <FormField name={name} />
	}

	return (
		<FormWrapperState formData={editProductFormData}>
			<FormWrapper
				title="Изменение товара"
				formCallback={submitHandler}
				formBtnText="Сохранить товар"
				formData={filledFormData}
				goFurther={goFurther}
			>
				{Object.keys(filledFormData.fields).map((fieldName) =>
					formFieldRender(filledFormData.fields[fieldName].type, fieldName)
				)}
			</FormWrapper>
		</FormWrapperState>
	)
}
