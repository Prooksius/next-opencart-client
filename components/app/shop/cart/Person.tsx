import { listTranslations } from '@/store/slices/globalsSlice'
import SimpleFormWrapper from '@/components/app/forms/formWrapper/SimpleFormWrapper'
import { useSelector, useDispatch } from 'react-redux'
import { FormWrapperState } from '@/components/app/forms/formWrapper/FormWrapperState'
import { checkoutPersonFormData } from '@/components/formConfigs/checkoutPersonConfig'
import { listCustomerData, setCustomerData } from '@/store/slices/cartSlice'
import { _fieldsList } from '@/components/app/forms/formWrapper/_fieldsList'
import { FieldType, MyFormData } from '@/components/app/forms/formWrapper/types'
import { AppDispatch } from '@/store/store'

export const Person = () => {
	const dispatch = useDispatch<AppDispatch>()
	const translations = useSelector(listTranslations)

	const customerData = useSelector(listCustomerData)

	const filledFormData = Object.assign({}, checkoutPersonFormData)

	if (customerData) {
		filledFormData.fields!.name.value = customerData.first_name
			? customerData.first_name
			: ''
		filledFormData.fields!.name.value = customerData.last_name
			? customerData.last_name
			: ''
		filledFormData.fields!.email.value = customerData.email
			? customerData.email
			: ''
		filledFormData.fields!.phone.value = customerData.phone
			? customerData.phone
			: ''
	}

	const submitHandler = (token: string, formData: MyFormData) => {
		console.log('formData', formData)
		dispatch(setCustomerData({ ...formData.fields }))
	}

	const formFieldRender = (type: FieldType, name: string) => {
		const FormField = _fieldsList[type]
		return <FormField name={name} key={name} />
	}

	return (
		<FormWrapperState formData={checkoutPersonFormData}>
			<h3>{translations('CheckoutYourData')}</h3>
			<SimpleFormWrapper formCallback={submitHandler} formData={filledFormData}>
				{Object.keys(filledFormData.fields!).map((fieldName) =>
					formFieldRender(filledFormData.fields![fieldName].type, fieldName)
				)}
			</SimpleFormWrapper>
		</FormWrapperState>
	)
}
