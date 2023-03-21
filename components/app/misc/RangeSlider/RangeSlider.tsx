import { ChangeEvent, useState, useCallback, useEffect, useRef } from 'react'
import styles from './RangeSlider.module.css'
import {
	listFilters,
	changePriceFilters,
	toggleGroup,
} from '@/store/slices/categoriesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import debounce from 'lodash.debounce'

interface RangeSliderProps {}

export const RangeSlider = ({}: RangeSliderProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const filters = useSelector(listFilters)!

	const [minValue, setMinValue] = useState(filters.original_min_price)
	const [minEditValue, setMinEditValue] = useState(filters.min_price)
	const [maxValue, setMaxValue] = useState(filters.original_max_price)
	const [maxEditValue, setMaxEditValue] = useState(filters.max_price)

	const [minPercent, setMinPercent] = useState(0)
	const [maxPercent, setMaxPercent] = useState(0)
	const [disabled, setDisabled] = useState(true)

	const calcAllValues = () => {
		setDisabled(filters.original_max_price === filters.original_min_price)
		if (filters.original_max_price === filters.original_min_price) {
			setMinPercent(0)
			setMaxPercent(100)
		} else {
			setMinPercent(
				((minValue - filters.original_min_price) /
					(filters.original_max_price - filters.original_min_price)) *
					100
			)
			setMaxPercent(
				((maxValue - filters.original_min_price) /
					(filters.original_max_price - filters.original_min_price)) *
					100
			)
		}
	}

	const doSetRange = () => {
		if (
			minEditValue !== filters.min_price ||
			maxEditValue !== filters.max_price
		) {
			dispatch(
				changePriceFilters({
					min: minEditValue,
					max: maxEditValue,
				})
			)
		}
	}

	// eslint-disable-next-line
	const debouncedSaveMinVlue = useCallback(
		debounce(() => doSetRange(), 800),
		[minEditValue]
	)

	// eslint-disable-next-line
	const debouncedSaveMaxValue = useCallback(
		debounce(() => doSetRange(), 800),
		[maxEditValue]
	)

	useEffect(() => {
		const curMinValue = filters.min_price
			? Number(filters.min_price)
			: filters.original_min_price
		const curMaxValue = filters.max_price
			? Number(filters.max_price)
			: filters.original_max_price

		setMinValue(curMinValue)
		setMaxValue(curMaxValue)
		// eslint-disable-next-line
	}, [
		filters.min_price,
		filters.max_price,
		filters.original_min_price,
		filters.original_max_price,
	])

	useEffect(() => {
		calcAllValues()
		// eslint-disable-next-line
	}, [
		minValue,
		maxValue,
		filters.min_price,
		filters.max_price,
		filters.original_min_price,
		filters.original_max_price,
	])

	useEffect(() => {
		debouncedSaveMinVlue()
		return debouncedSaveMinVlue.cancel
		// eslint-disable-next-line
	}, [minEditValue, debouncedSaveMinVlue])

	useEffect(() => {
		debouncedSaveMaxValue()
		return debouncedSaveMaxValue.cancel
		// eslint-disable-next-line
	}, [maxEditValue, debouncedSaveMaxValue])

	const changeMinSliderValue = (value: number) => {
		let newValue = value
		if (value > maxValue) {
			newValue = maxValue
		} else if (value < filters.original_min_price) {
			newValue = filters.original_min_price
		}
		setMinValue(newValue)
		setMinEditValue(
			newValue > filters.original_min_price ? newValue.toString() : ''
		)
	}
	const changeMaxSliderValue = (value: number) => {
		let newValue = value
		if (value < minValue) {
			newValue = minValue
		} else if (value > filters.original_max_price) {
			newValue = filters.original_max_price
		}
		setMaxValue(newValue)
		setMaxEditValue(
			newValue < filters.original_max_price ? newValue.toString() : ''
		)
	}

	return (
		<>
			<div className={styles.wrapper}>
				<div className={styles.valuesContainer}>
					<input
						type="text"
						className={styles.values}
						disabled={disabled}
						value={minEditValue ? minEditValue : ''}
						onChange={(e) => setMinEditValue(e.target.value)}
					/>
					-
					<input
						type="text"
						className={styles.values}
						disabled={disabled}
						value={maxEditValue ? maxEditValue : ''}
						onChange={(e) => setMaxEditValue(e.target.value)}
					/>
				</div>
				<div className={styles.container}>
					<div
						className={styles.track}
						style={{
							background: `linear-gradient(to right, #dadae5 ${minPercent}% , #3264fe ${minPercent}% , #3264fe ${maxPercent}%, #dadae5 ${maxPercent}%)`,
						}}
					></div>
					<div className={styles.minMaxValues}>
						<div>{filters.original_min_price}</div>
						<div>{filters.original_max_price}</div>
					</div>
					<input
						type="range"
						disabled={disabled}
						className={styles.input}
						min={filters.original_min_price}
						max={filters.original_max_price}
						value={minValue}
						onChange={(e) => changeMinSliderValue(Number(e.target.value))}
						style={{
							zIndex: minValue === filters.original_max_price ? '2' : 'auto',
						}}
					/>
					<input
						type="range"
						disabled={disabled}
						className={styles.input}
						min={filters.original_min_price}
						max={filters.original_max_price}
						value={maxValue}
						onChange={(e) => changeMaxSliderValue(Number(e.target.value))}
					/>
				</div>
			</div>
		</>
	)
}
