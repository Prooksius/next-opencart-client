import { listTranslations } from '@/store/slices/globalsSlice'
import SimpleFormWrapper from '@/components/app/forms/formWrapper/SimpleFormWrapper'
import { toastAlert } from 'config'
import { useSelector, useDispatch } from 'react-redux'
import { FormWrapperState } from '@/components/app/forms/formWrapper/FormWrapperState'
import { checkoutPersonFormData } from '@/components/formConfigs/checkoutPersonConfig'
import { listCustomerData, setCustomerData } from '@/store/slices/cartSlice'
import { useEffect, useState } from 'react'
import { formFields } from '@/components/app/forms/formWrapper/FormWrapper'

export const Person = () => {
	const dispatch = useDispatch()
	const translations = useSelector(listTranslations)

	const customerData = useSelector(listCustomerData)

	const filledFormData = Object.assign({}, checkoutPersonFormData)

	if (customerData) {
		filledFormData.fields.name.value = customerData.name
			? customerData.name
			: ''
		filledFormData.fields.email.value = customerData.email
			? customerData.email
			: ''
		filledFormData.fields.phone.value = customerData.phone
			? customerData.phone
			: ''
	}

	const submitHandler = (formData) => {
		console.log('formData', formData)
		dispatch(setCustomerData({ ...formData.fields }))
	}

	const formFieldRender = (type, name) => {
		const FormField = formFields[type]
		return <FormField name={name} key={name} />
	}

	return (
		<FormWrapperState formData={checkoutPersonFormData}>
			<h3>{translations('CheckoutYourData')}</h3>
			<SimpleFormWrapper formCallback={submitHandler} formData={filledFormData}>
				{Object.keys(filledFormData.fields).map((fieldName) =>
					formFieldRender(filledFormData.fields[fieldName].type, fieldName)
				)}
			</SimpleFormWrapper>
		</FormWrapperState>
	)
}
