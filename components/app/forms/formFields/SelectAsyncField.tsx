import { useCallback, useContext, useEffect, useState } from 'react'
import classnames from 'classnames'
import { FormWrapperContext } from '../formWrapper/formWrapperContext'
import { GroupBase, components } from 'react-select'
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate'
import type {
	Additional,
	DefaultSelectValue,
} from '@/components/app/forms/formWrapper/types'
import Image from 'next/image'

const { SingleValue, Option } = components

const IconSingleValue = (props: any) => (
	<SingleValue {...props}>
		<Image
			src={props.data.image}
			alt=""
			style={{
				height: '30px',
				width: '30px',
				borderRadius: '2px',
				marginRight: '10px',
				objectFit: 'contain',
			}}
		/>
		{props.data.label}
	</SingleValue>
)

const IconOption = (props: any) => (
	<Option {...props}>
		<Image
			src={props.data.image}
			alt=""
			style={{
				height: '30px',
				width: '30px',
				borderRadius: '2px',
				marginRight: '10px',
				objectFit: 'contain',
			}}
		/>
		{props.data.label}
	</Option>
)

// Step 3
const customStyles = {
	option: (provided: any) => ({
		...provided,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	}),
	singleValue: (provided: any) => ({
		...provided,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	}),
}

type SearchResults = {
	value: string
	label?: string
}
type SearchReturn = {
 options: SearchResults[]
	hasMore: boolean
	additional: {
		page: number
		param?: any
	}
}

interface SelectAsyncFieldProps {
	name: string
	searchCallback: LoadOptions<
		SearchResults,
		GroupBase<SearchResults>,
		Additional
	>
	// searchCallback: (
	// 	search: string,
	// 	loadedOptions: readonly SearchResults[],
	// 	additional: Additional
	// ) => Promise<SearchReturn>
}

const SelectAsyncField = ({ name, searchCallback }: SelectAsyncFieldProps) => {
	const { form, setFieldValue } = useContext(FormWrapperContext)

	const thisField = form.fields ? form.fields[name] : null
	const [inputValue, setInputValue] = useState(thisField?.valueObj?.label)

	if (!thisField) {
		return (
			<div className="form-field">
				{name} - Ошибка: поле не найдено в списке полей формы
			</div>
		)
	}

	const defaultOptions: DefaultSelectValue[] = []
	if (thisField.valueObj.value) {
		//defaultOptions.push(thisField.valueObj)
	}

	const required = thisField.validations.required || false
	const dropdownType = thisField.dropdown || 'default'

	return (
		<div
			className={classnames(
				'form-field',
				{ hasValue: thisField.valueObj.label },
				{ invalid: thisField.errorMessage },
				{ valid: !thisField.errorMessage && thisField.dirty }
			)}
		>
			{dropdownType === 'images' && (
				<AsyncPaginate
					defaultOptions={defaultOptions}
					styles={customStyles}
					value={thisField.valueObj}
					className="multiselect"
					classNamePrefix="inner"
					components={{
						SingleValue: IconSingleValue,
						Option: IconOption,
						IndicatorSeparator: () => null,
					}}
					onChange={(selectedOption) =>
						setFieldValue({
							field: name,
							value: selectedOption ? selectedOption : '',
						})
					}
					getOptionLabel={(e) => (e.label ? e.label : '')}
					formatOptionLabel={(option, { context }) => {
						return (
							<span
								dangerouslySetInnerHTML={{
									__html: option.label ? option.label : '',
								}}
							></span>
						)
					}}
					getOptionValue={(e) => e.value}
					loadOptions={searchCallback}
					inputValue={inputValue}
					onInputChange={(value: string) => setInputValue(value)}
					additional={{
						page: 1,
					}}
				/>
			)}
			{dropdownType !== 'images' && (
				<AsyncPaginate
					defaultOptions={defaultOptions}
					debounceTimeout={500}
					value={thisField.valueObj}
					className="multiselect"
					classNamePrefix="inner"
					components={{
						IndicatorSeparator: () => null,
					}}
					onChange={(selectedOption) =>
						setFieldValue({
							field: name,
							value: selectedOption ? selectedOption : '',
						})
					}
					getOptionLabel={(e) => (e.label ? e.label : '')}
					formatOptionLabel={(option, { context }) => {
						//            if (context !== "menu") return option.label
						return (
							<span
								dangerouslySetInnerHTML={{
									__html: option.label ? option.label : '',
								}}
							></span>
						)
					}}
					getOptionValue={(e) => e.value}
					loadOptions={searchCallback}
					onInputChange={(value: string) => setInputValue(value)}
					additional={{
						page: 1,
					}}
				/>
			)}
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

export default SelectAsyncField
