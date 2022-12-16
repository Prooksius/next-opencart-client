import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FormWrapperContext } from '../formWrapper/formWrapperContext'

const TextField = ({ name }) => {
	const { form, setFieldValue } = useContext(FormWrapperContext)

	const thisField = form?.fields[name] || ''
	const required = thisField?.validations.required || false

	return (
		<div
			className={classnames(
				'form-field',
				{ hasValue: thisField.value },
				{ invalid: thisField.errorMessage },
				{ valid: !thisField.errorMessage && thisField.dirty }
			)}
		>
			<input
				type={thisField.type}
				autoComplete="off"
				value={thisField.value}
				onChange={(e) => setFieldValue({ field: name, value: e.target.value })}
			/>
			<label>
				{thisField.label}
				{required && <span className="required">*</span>}
			</label>
			<small
				className={classnames('error-label', {
					opened: thisField.errorMessage,
				})}
			>
				{thisField.errorMessage}
			</small>
		</div>
	)
}

TextField.propTypes = {
	name: PropTypes.string.isRequired,
}

export default TextField
