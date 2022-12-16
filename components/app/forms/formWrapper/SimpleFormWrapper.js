import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FormWrapperContext } from './formWrapperContext'
import { useSelector } from 'react-redux'

const SimpleFormWrapper = ({ children, formCallback, formData }) => {
	const { form, setForm, checkForm } = useContext(FormWrapperContext)

	const isFormValid = () =>
		Object.entries(form.fields).every(
			([key, value]) => value.errorMessage === ''
		)

	const formValidate = async (event) => {
		await checkForm()

		await formCallback(form)
	}

	useEffect(() => {
		setForm(formData)
		return () => setForm({})
		// eslint-disable-next-line
	})

	return <form onChange={formValidate}>{children}</form>
}

SimpleFormWrapper.defaultProps = {
	formCallback: undefined,
}

SimpleFormWrapper.propTypes = {
	formCallback: PropTypes.func.isRequired,
}

export default SimpleFormWrapper
