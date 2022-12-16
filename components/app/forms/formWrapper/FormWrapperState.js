import React, { ReactNode, useReducer } from 'react'
import { CHECK_FORM, SET_FIELD, SET_FORM } from './types'
import { FormWrapperContext } from './formWrapperContext'
import { formWrapperReducer } from './formWrapperReducer'

export const FormWrapperState = ({ children, formData }) => {
	const [formState, dispatch] = useReducer(formWrapperReducer, formData)

	const setForm = (form) => dispatch({ type: SET_FORM, payload: form })

	const checkForm = () => dispatch({ type: CHECK_FORM })

	const setFieldValue = (field) => dispatch({ type: SET_FIELD, payload: field })

	const contextProps = {
		form: formData,
		checkForm,
		setForm,
		setFieldValue,
	}

	return (
		<FormWrapperContext.Provider value={contextProps}>
			{children}
		</FormWrapperContext.Provider>
	)
}
