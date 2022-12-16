import Image from 'next/image'
import Datetime from 'react-datetime'
import {
	listTranslations,
	listLanguages,
	listSettings,
} from '@/store/slices/globalsSlice'
import { addToCart } from '@/store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { REACT_APP_IMAGE_URL } from 'config'
import moment from 'moment'
import 'moment/locale/ru'
import 'react-datetime/css/react-datetime.css'
import classNames from 'classnames'
import { useRef, useState } from 'react'

const optionsWithValue = ['text', 'textarea', 'date', 'datetime', 'time']

export const ProductPageOptions = ({ product, setProduct, showQuantity, minQuantity, submitHandler }) => {
	const dateTimeContRef = useRef(null)
	const translations = useSelector(listTranslations)
	const languages = useSelector(listLanguages)

	const [quantity, setQuantity] = useState(minQuantity)

	const setProductOptions = ({
		value,
		product_option_id,
		product_option_value_id,
	}) => {
		const optionFound = product.options.find(
			(option) => +option.product_option_id === +product_option_id
		)
		if (optionFound) {
			console.log('option found')
			if (optionsWithValue.includes(optionFound.type)) {
				optionFound.value = value
			} else if (optionFound.type === 'radio') {
				optionFound.product_option_value.map((value) => {
					if (+value.product_option_value_id === +product_option_value_id) {
						value.is_selected = true
						optionFound.error = ''
					} else {
						value.is_selected = false
					}
				})
			} else if (optionFound.type === 'checkbox') {
				optionFound.product_option_value.map((value) => {
					if (+value.product_option_value_id === +product_option_value_id) {
						value.is_selected = !value.is_selected
						if (value.is_selected) {
							optionFound.error = ''
						}
					}
				})
			} else if (optionFound.type === 'select') {
				optionFound.product_option_value.map((value) => {
					if (+value.product_option_value_id === +product_option_value_id) {
						console.log('option value found')

						value.is_selected = true
						optionFound.error = ''
					} else {
						console.log('option value not found')
						value.is_selected = false
					}
				})
			}
			setProduct(product)
		}
	}

	const setProductOptionError = ({ product_option_id, error }) => {
		const optionFound = product.options.find(
			(option) => +option.product_option_id === +product_option_id
		)
		if (optionFound) {
			console.log('option found', error)
			optionFound.error = error
		}
		setProduct(product)
	}

	const setSingleOptionValue = (value, product_option_id) => {
		setProductOptions({
			value,
			product_option_id,
		})
	}

	const setMultOptionValue = (product_option_id, product_option_value_id) => {
		console.log('product_option_id', product_option_id)
		console.log('product_option_value_id', product_option_value_id)
		setProductOptions({
			product_option_id,
			product_option_value_id,
		})
	}

	const checkOptions = () => {
		let error = false
		let errorText = ''
		product.options.map((option) => {
			if (option.required) {
				if (optionsWithValue.includes(option.type)) {
					if (!option.value) {
						error = true
						errorText = translations('CartOptionsRequired', [option.name])
						console.log('found')
					} else {
						errorText = ''
					}
					setProductOptionError({
						product_option_id: option.product_option_id,
						error: errorText,
					})
				} else {
					if (
						!option.product_option_value.filter((value) => value.is_selected)
							.length
					) {
						error = true
						errorText = translations('CartOptionsRequired', [option.name])
						console.log('found')
					} else {
						errorText = ''
					}
					setProductOptionError({
						product_option_id: option.product_option_id,
						error: errorText,
					})
				}
			}
		})
		setProduct(product)

		if (!error) submitHandler(quantity)
	}

	return (
		<div className="product-page-options__cont">
			{product.options.length > 0 && (
				<>
					<h3>{translations('ProductAvailableOptions')}</h3>
					<div className="product-options__area">
						{product.options.map((option) => (
							<div
								className={classNames('product-options__item', {
									required: option.required,
								})}
								key={option.product_option_id}
							>
								<h4>{option.name}</h4>
								<div className="product-options__values">
									{option.product_option_value.map((value) => (
										<div
											className="product-options__value"
											key={
												option.product_option_id +
												'-' +
												value.product_option_value_id
											}
										>
											{option.type === 'radio' && (
												<label>
													<input
														type="radio"
														name={option.alias}
														value={value.alias}
														checked={value.is_selected}
														onChange={(event) =>
															setMultOptionValue(
																option.product_option_id,
																value.product_option_value_id
															)
														}
													/>
													{value.name}
												</label>
											)}
											{option.type === 'checkbox' && (
												<label>
													<input
														type="checkbox"
														name={option.alias}
														value={value.alias}
														checked={value.is_selected}
														onChange={(event) =>
															setMultOptionValue(
																option.product_option_id,
																value.product_option_value_id
															)
														}
													/>
													{value.name}
												</label>
											)}
										</div>
									))}
									{option.type === 'select' && (
										<select
											name={option.alias}
											onChange={(event) =>
												setMultOptionValue(
													option.product_option_id,
													event.target.value
												)
											}
										>
											{!option.required && (
												<option value="">
													{translations('AppChooseValue')}
												</option>
											)}
											{option.product_option_value.map((value) => (
												<option
													key={
														option.product_option_id +
														'-' +
														value.product_option_value_id
													}
													value={value.product_option_value_id}
												>
													{value.name}
												</option>
											))}
										</select>
									)}
									{option.type === 'text' && (
										<input
											type="text"
											value={option.value}
											onChange={(event) =>
												setSingleOptionValue(
													event.target.value,
													option.product_option_id
												)
											}
										/>
									)}
									{option.type === 'textarea' && (
										<textarea
											type="text"
											value={option.value}
											onChange={(event) =>
												setSingleOptionValue(
													event.target.value,
													option.product_option_id
												)
											}
											name={option.alias}
										></textarea>
									)}
									{option.type === 'datetime' && (
										<div className="form-field" ref={dateTimeContRef}>
											<Datetime
												locale={
													languages.find((lang) => lang.selected === true)
														.code !== 'ru'
														? 'en'
														: 'ru'
												}
												value={option.value}
												closeOnSelect={true}
												onChange={(value) =>
													setSingleOptionValue(
														value.format('DD.MM.YYYY kk:mm'),
														option.product_option_id
													)
												}
											/>
										</div>
									)}
									{option.type === 'date' && (
										<Datetime
											locale={
												languages.find((lang) => lang.selected === true)
													.code !== 'ru'
													? 'en'
													: 'ru'
											}
											timeFormat={false}
											closeOnSelect={true}
											value={option.value}
											onChange={(value) =>
												setSingleOptionValue(
													value.format('DD.MM.YYYY'),
													option.product_option_id
												)
											}
										/>
									)}
									{option.type === 'time' && (
										<>
											<Datetime
												locale={
													languages.find((lang) => lang.selected === true)
														.code !== 'ru'
														? 'en'
														: 'ru'
												}
												dateFormat={false}
												value={option.value}
												onChange={(value) =>
													setSingleOptionValue(
														value.format('kk:mm'),
														option.product_option_id
													)
												}
											/>
										</>
									)}
								</div>
								<span className="error">{option.error}</span>
							</div>
						))}
					</div>
				</>
			)}
			<div className="product-options__item">
				<input
					type="text"
					value={quantity}
					onChange={(e) => setQuantity(e.target.value)}
				/>
			</div>
			<div className="product-options__buttons">
				<button type="button" className="btn btn-blue" onClick={checkOptions}>
					{translations('CartAddToCart')}
				</button>
			</div>
		</div>
	)
}
