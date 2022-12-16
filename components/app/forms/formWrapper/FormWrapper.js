import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { createSlot } from 'react-slotify'
import classnames from 'classnames'
import { Loader } from '@/components/app/Loader'
import { FormWrapperContext } from './formWrapperContext'
import ReCaptcha from '../recaptcha/ReCaptcha'
import { useSelector } from 'react-redux'
import { Success } from '@/components/app/icons/Success'
import TextField from '@/components/app/forms/formFields/TextField'
import TextareaField from '@/components/app/forms/formFields/TextareaField'
import SelectField from '@/components/app/forms/formFields/SelectField'

export const HeaderSlot = createSlot()
export const FooterSlot = createSlot()
export const PrivacySlot = createSlot()

export const formFields = {
	text: TextField,
	textarea: TextareaField,
	select: SelectField,
}

const FormWrapper = ({
	children,
	title,
	formBtnText,
	formCallback,
	goFurther,
	formData,
}) => {
	const sitekey = '6Ld8b-kaAAAAAKKyKxG3w3RW0hCxqBelwko_jTFZ'
	const { form, setForm, checkForm } = useContext(FormWrapperContext)

	//const editStatus = useSelector((state) => state.notes.editStatus)

	const [submitStatus, setSubmitStatus] = useState('IDLE')
	const [formMessage, setFormMessage] = useState('')
	const [recaptcha, setRecaptcha] = useState(null)

	const isFormValid = () =>
		Object.entries(form.fields).every(
			([key, value]) => value.errorMessage === ''
		)

	const formValidate = async (event) => {
		event.preventDefault()

		setSubmitStatus('IDLE')
		setFormMessage('')

		await checkForm()

		if (isFormValid()) {
			const token = await recaptcha.execute()
			submitForm(token)
		} else {
			setSubmitStatus('ERROR')
			setFormMessage('Form has errors')
		}
	}
	const submitForm = async (token) => {
		console.log('FormWrapper - doSubmit')
		try {
			setSubmitStatus('PENDING')
			await formCallback(token, form)
			setSubmitStatus('OK')
			setTimeout(() => {
				if (goFurther) goFurther(form)
			}, 1000)
		} catch (err) {
			setSubmitStatus('ERROR')
			setFormMessage(err.message)
			console.error(err)
		}
	}

	useEffect(() => {
		setForm(formData)
		return () => setForm({})
	})

	return (
		<form onSubmit={formValidate}>
			<HeaderSlot.Renderer childs={children}>
				{title !== '' && <h3>{title}</h3>}
			</HeaderSlot.Renderer>
			{children}
			<ReCaptcha
				ref={(ref) => setRecaptcha(ref)}
				sitekey={sitekey}
				action=""
				verifyCallback={null}
			/>
			{submitStatus !== 'IDLE' && (
				<p
					className={classnames('message', {
						success: submitStatus === 'OK',
						error: submitStatus === 'ERROR',
					})}
				>
					{formMessage}
				</p>
			)}
			<FooterSlot.Renderer childs={children}>
				<button
					type="submit"
					className={classnames('btn', {
						pending: submitStatus === 'PENDING',
						success: submitStatus === 'OK',
					})}
					disabled={submitStatus === 'PENDING'}
				>
					{submitStatus === 'PENDING' && <Loader />}
					{submitStatus === 'OK' && <Success />}
					<span>{formBtnText}</span>
				</button>
			</FooterSlot.Renderer>
			<PrivacySlot.Renderer childs={children} />
		</form>
	)
}

FormWrapper.defaultProps = {
	title: '',
	formBtnText: '',
	formCallback: undefined,
	goFurther: undefined,
}

FormWrapper.propTypes = {
	title: PropTypes.string,
	formBtnText: PropTypes.string,
	formCallback: PropTypes.func.isRequired,
	goFurther: PropTypes.func,
}

export default FormWrapper
