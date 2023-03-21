import { useContext, useEffect, useState } from 'react'
import classnames from 'classnames'
import Datetime from 'react-datetime'
import 'moment/locale/ru'
import { FormWrapperContext } from '../formWrapper/formWrapperContext'
import { CalendarIcon } from '@/components/app/icons/CalendarIcon'
import 'react-datetime/css/react-datetime.css'
import type { FieldData } from '../formWrapper/types'
import moment from 'moment'

type CalendarPlace = 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom'

interface DateTimeFieldProps {
	name: string
	timeFormat: boolean
	future?: boolean
	calendar?: CalendarPlace
}

const DateTimeField = ({
	name,
	timeFormat,
	future = false,
	calendar = 'left-bottom',
}: DateTimeFieldProps) => {
	const { form, setFieldValue } = useContext(FormWrapperContext)
	const [depValue, setDepValue] = useState(true)
	const [disabled, setDisabled] = useState(false)

	const thisField = form.fields ? form.fields[name] : null
	const dependField =
		thisField && thisField.dependency && form.fields
			? form.fields[thisField.dependency.field]
			: null

	const today = moment()
	const valid = function (current: moment.Moment) {
		return future ? current.isAfter(today) : true
	}

	const getDepFieldValue = (thisField: FieldData | null): boolean => {
		if (thisField && thisField.dependency && dependField) {
			if (['checkbox'].includes(dependField.type)) {
				return dependField.value === '1' ? true : false
			}
		}
		return true
	}

	useEffect(() => {
		const setDeps = async () => {
			const val = getDepFieldValue(thisField)
			if (dependField && depValue != val) {
				if (thisField && thisField.dependency?.type === 'disable') {
					if (depValue) {
						setDisabled(true)
						setFieldValue({
							field: name,
							value: '',
						})
					} else {
						setDisabled(false)
					}
					setDepValue(val)
				}
			}
		}
		setDeps()
	})

	if (!thisField) {
		return (
			<div className="form-field">
				{name} - Поле не найдено в списке полей формы
			</div>
		)
	}

	const required = thisField.validations.required || false

	return (
		<div
			className={classnames(
				'form-field',
				'date-time-field',
				'calendar-' + calendar,
				{ disabled },
				{ hasValue: thisField.value },
				{ invalid: thisField.errorMessage },
				{ valid: !thisField.errorMessage && thisField.dirty }
			)}
		>
			<Datetime
				locale={'ru'}
				className="form-field"
				value={thisField.value || ''}
				inputProps={{ value: thisField.value || '', disabled }}
				timeFormat={timeFormat}
				closeOnSelect={true}
				isValidDate={valid}
				onChange={(value) =>
					setFieldValue({
						field: name,
						value:
							typeof value === 'string' ? value : value.format('DD.MM.YYYY'),
					})
				}
			/>
			<label>
				{thisField.label}
				{required && <span className="required">*</span>}
			</label>
			<CalendarIcon />
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

export default DateTimeField
