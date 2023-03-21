import { ReactNode, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FormWrapperContext } from './formWrapperContext'
import { useSelector } from 'react-redux'
import { MyFormData } from './types'

interface SimpleFormWrapperProps {
	children: ReactNode
	formCallback: (token: string, form: MyFormData) => void
	formData: MyFormData
}

const SimpleFormWrapper = ({
	children,
	formCallback,
	formData,
}: SimpleFormWrapperProps) => {
	const { form, setForm, checkForm } = useContext(FormWrapperContext)

	const isFormValid = () =>
		Object.entries(form.fields ? form.fields : []).every(
			([key, value]) => value.errorMessage === ''
		)

	const formValidate = async () => {
		checkForm()

		formCallback('', form)
	}

	useEffect(() => {
		setForm(formData)
		return () => setForm({})
		// eslint-disable-next-line
	})

	return <form onChange={formValidate}>{children}</form>
}

export default SimpleFormWrapper