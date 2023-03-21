import { listTranslations } from '@/store/slices/globalsSlice'
import SimpleFormWrapper from '@/components/app/forms/formWrapper/SimpleFormWrapper'
import { useSelector, useDispatch } from 'react-redux'
import { FormWrapperState } from '@/components/app/forms/formWrapper/FormWrapperState'
import { checkoutCommentFormData } from '@/components/formConfigs/checkoutCommentConfig'
import {
	listCustomerComment,
	setCustomerComment,
} from '@/store/slices/cartSlice'
import { _fieldsList } from '@/components/app/forms/formWrapper/_fieldsList'
import { FieldType, MyFormData } from '@/components/app/forms/formWrapper/types'
import { AppDispatch } from '@/store/store'

export const Comment = () => {
	const dispatch = useDispatch<AppDispatch>()
	const translations = useSelector(listTranslations)

	const customerComment = useSelector(listCustomerComment)

	const filledFormData = Object.assign({}, checkoutCommentFormData)

	if (customerComment) {
		filledFormData.fields!.comment.value = customerComment
	}

	const submitHandler = (token: string, formData: MyFormData) => {
		console.log('formData', formData)
		dispatch(setCustomerComment(formData.fields!.comment.value))
	}

	const formFieldRender = (type: FieldType, name: string) => {
		const FormField = _fieldsList[type]
		return <FormField name={name} key={name} />
	}

	return (
		<FormWrapperState formData={checkoutCommentFormData}>
			<h3>{translations('CheckoutYourData')}</h3>
			<SimpleFormWrapper formCallback={submitHandler} formData={filledFormData}>
				{Object.keys(filledFormData.fields!).map((fieldName) =>
					formFieldRender(filledFormData.fields![fieldName].type, fieldName)
				)}
			</SimpleFormWrapper>
		</FormWrapperState>
	)
}
