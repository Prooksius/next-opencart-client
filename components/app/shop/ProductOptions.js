import Image from 'next/image'
import Datetime from 'react-datetime'
import {
	selectProductById,
	clearShowProductOptions,
	assignProductOption,
	ListCurOptions,
	setProductOption,
	setProductOptionError,
	setOptionsUpdated,
	setShowProductOptionsId,
	clearOptionsUpdated,
	listQuantity,
	setQuantity,
} from '@/store/slices/productsSlice'
import {
	listTranslations,
	listLanguages,
	listSettings,
} from '@/store/slices/globalsSlice'
import { addToCart } from '@/store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ru'
import 'react-datetime/css/react-datetime.css'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { REACT_APP_IMAGE_URL, optionsWithValue } from 'config'

export const ProductOptions = ({ productPage, showQuantity }) => {
	const dispatch = useDispatch()
	const dateTimeContRef = useRef(null)

	const quantity = useSelector(listQuantity)
	const curOptions = useSelector(ListCurOptions)

	const translations = useSelector(listTranslations)
	const languages = useSelector(listLanguages)

	const setSingleOptionValue = (value, product_option_id) => {
		dispatch(
			setProductOption({
				page: productPage,
				product_option_id,
				value,
			})
		)
	}

	const setMultOptionValue = (product_option_id, product_option_value_id) => {
		console.log('product_option_id', product_option_id)
		console.log('product_option_value_id', product_option_value_id)
		dispatch(
			setProductOption({
				page: productPage,
				product_option_id,
				product_option_value_id,
			})
		)
	}

	const checkOptions = () => {
		let error = false
		let errorText = ''
		curOptions(productPage).map((option) => {
			if (option.required) {
				if (optionsWithValue.includes(option.type)) {
					if (!option.value) {
						error = true
						errorText = translations('CartOptionsRequired', [option.name])
						console.log('found')
					} else {
						errorText = ''
					}
					dispatch(
						setProductOptionError({
							page: productPage,
							product_option_id: option.product_option_id,
							error: errorText,
						})
					)
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
					dispatch(
						setProductOptionError({
							page: productPage,
							product_option_id: option.product_option_id,
							error: errorText,
						})
					)
				}
			}
		})

		if (!error) {
			if (showQuantity) {
				dispatch(
					setQuantity({ page: productPage, quantity: quantity(productPage) })
				)
				dispatch(setOptionsUpdated({ page: productPage }))
			} else {
				dispatch(setQuantity({ page: productPage, quantity: 1 }))
				dispatch(setOptionsUpdated({ page: productPage }))
			}
		}
	}

	return (
		<div
			className={classNames('product-options__cont', {
				'page-cont': productPage,
			})}
		>
			{curOptions(productPage).length > 0 && (
				<>
					<h3>{translations('ProductAvailableOptions')}</h3>
					<div className="product-options__area">
						{curOptions(productPage).map((option) => (
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
														onClick={(event) =>
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
														onClick={(event) =>
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
											<option value="">{translations('AppChooseValue')}</option>
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
												inputProps={{ readOnly: true }}
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
											inputProps={{ readOnly: true }}
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
												inputProps={{ readOnly: true }}
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
								{option.error !== '' && (
									<span className="error">{option.error}</span>
								)}
							</div>
						))}
					</div>
				</>
			)}
			{showQuantity && (
				<div className="product-options__item">
					<input
						type="text"
						value={quantity(productPage)}
						onChange={(e) =>
							dispatch(
								setQuantity({ quantity: e.target.value, page: productPage })
							)
						}
					/>
				</div>
			)}
			<div className="product-options__buttons">
				<button type="button" className="btn btn-blue" onClick={checkOptions}>
					{translations('CartAddToCart')}
				</button>
			</div>
		</div>
	)
}
