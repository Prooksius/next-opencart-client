import { listTranslations } from '@/store/slices/globalsSlice'
import SimpleFormWrapper from '@/components/app/forms/formWrapper/SimpleFormWrapper'
import { toastAlert } from 'config'
import { useSelector, useDispatch } from 'react-redux'
import { FormWrapperState } from '@/components/app/forms/formWrapper/FormWrapperState'
import { checkoutCommentFormData } from '@/components/formConfigs/checkoutCommentConfig'
import {
	listCustomerComment,
	setCustomerComment,
} from '@/store/slices/cartSlice'
import { useEffect, useState } from 'react'
import { formFields } from '@/components/app/forms/formWrapper/FormWrapper'

export const Comment = () => {
	const dispatch = useDispatch()
	const translations = useSelector(listTranslations)

	const customerComment = useSelector(listCustomerComment)

	const filledFormData = Object.assign({}, checkoutCommentFormData)

	if (customerComment) {
		filledFormData.fields.comment.value = customerComment
	}

	const submitHandler = (formData) => {
		console.log('formData', formData)
		dispatch(setCustomerComment(formData.fields.comment.value))
	}

	const formFieldRender = (type, name) => {
		const FormField = formFields[type]
		return <FormField name={name} key={name} />
	}

	return (
		<FormWrapperState formData={checkoutCommentFormData}>
			<h3>{translations('CheckoutYourData')}</h3>
			<SimpleFormWrapper formCallback={submitHandler} formData={filledFormData}>
				{Object.keys(filledFormData.fields).map((fieldName) =>
					formFieldRender(filledFormData.fields[fieldName].type, fieldName)
				)}
			</SimpleFormWrapper>
		</FormWrapperState>
	)
}
