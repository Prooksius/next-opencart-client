import { ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import type {
	FieldData,
	MyFormData,
	FormField,
	StatusType,
	ErrorPayloadData,
} from './types'
import { createSlot } from 'react-slotify'
import classnames from 'classnames'
import { Loader } from '@/components/app/shop/global/Loader'
import { FormWrapperContext } from './formWrapperContext'
import ReCaptcha from '../recaptcha/ReCaptcha'
import { Success } from '@/components/app/icons/Success'

export const HeaderSlot = createSlot()
export const FooterSlot = createSlot()
export const PrivacySlot = createSlot()

interface FormWrapperProps {
	children: ReactNode
	title: string
	formBtnText: string
	formCallback: (token: string, form: MyFormData) => void
	editStatus?: StatusType | null
	editError?: string
	editErrorData?: ErrorPayloadData | null
	goFurther: () => void
	formData: MyFormData
}

const FormWrapper = ({
	children,
	title,
	formBtnText,
	formCallback,
	editStatus = null,
	editError = '',
	editErrorData = null,
	goFurther,
	formData,
}: FormWrapperProps): ReactElement => {
	const sitekey = '6Ld8b-kaAAAAAKKyKxG3w3RW0hCxqBelwko_jTFZ'
	const { form, setForm, checkForm, errorField } =
		useContext(FormWrapperContext)

	const [submitStatus, setSubmitStatus] = useState('IDLE')
	const [formMessage, setFormMessage] = useState('')
	const [recaptcha, setRecaptcha] = useState<ReCaptcha | null>(null)

	const isFormValid = () =>
		Object.entries(form.fields ? form.fields : []).every(
			([key, value]: FormField) => value.errorMessage === ''
		)

	const formValidate = async (event: React.FormEvent) => {
		event.preventDefault()

		setSubmitStatus('IDLE')
		setFormMessage('')

		checkForm()

		if (isFormValid()) {
			const token = recaptcha ? await recaptcha.execute() : ''
			submitForm(token ? token : '')
		} else {
			setSubmitStatus('ERROR')
			setFormMessage('Форма имеет ошибки')
		}
	}
	const submitForm = async (token: string) => {
		setSubmitStatus('PENDING')
		formCallback(token, form)
		if (editStatus === null) {
			setSubmitStatus('OK')
		}
	}

	const getUnusedErrors = (errorsData: ErrorPayloadData): string => {
		const errors: string[] = []
		if (errorsData) {
			if (typeof errorsData.detail !== 'string') {
				errorsData.detail.map((error) => {
					let field_name = '-'
					if (error.loc.length) {
						field_name = error.loc[error.loc.length - 1]
					}
					if (
						!Object.keys(form.fields ? form.fields : []).includes(field_name)
					) {
						const field = form.fields ? form.fields[field_name] : null
						if (field) {
							errors.push(error.msg)
						}
					}
				})
			} else {
				errors.push(errorsData.detail)
			}
		}
		return errors.join(', ')
	}

	useEffect(() => {
		if (submitStatus === 'PENDING') {
			if (editStatus === 'succeeded') {
				setSubmitStatus('OK')
				if (goFurther) goFurther()
			} else if (editStatus === 'failed') {
				console.log('error')
				setSubmitStatus('ERROR')
				if (editErrorData) {
					errorField(editErrorData)
					const errorForAll = getUnusedErrors(editErrorData)
					console.log('errorForAll', errorForAll)
					setFormMessage(errorForAll ? errorForAll : 'Форма имеет ошибки')
				} else {
					setFormMessage(editError)
				}
			}
		}
		// eslint-disable-next-line
	}, [editStatus])

	useEffect(() => {
		setForm(formData)
		return () => setForm({})
		// eslint-disable-next-line
	}, [])

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
				verifyCallback={() => {}}
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
					className={classnames('btn btn-blue', {
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

export default FormWrapper
