import { setTootipShow, listTooltipShow } from '@/store/slices/globalsSlice'
import {
	listCurrent,
	listFilters,
	listCategoriesStatus,
	changeFilters,
	getFilterPath,
	fetchCategory,
	isFiltersChanged,
	clearFilterChanged,
	resetFilters,
	clearCategories,
} from '@/store/slices/categoriesSlice'
import { REACT_APP_IMAGE_URL } from 'config'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'

export const SelectedFiltersBlock = () => {
	const filters = useSelector(listFilters)
	const dispatch = useDispatch()
	const tooltipShow = useSelector(listTooltipShow)

	const resetFilterValue = (event) => {
		dispatch(setTootipShow(false))
		console.log('filter manual change')
		const group = event.target.getAttribute('data-group')
		const param = event.target.getAttribute('data-param')
		const value = event.target.getAttribute('data-value')
		const item_type = event.target.getAttribute('data-item_type')

		dispatch(
			resetFilters({
				group,
				param,
				value,
				item_type,
			})
		)
	}

	const tooltipOn = () => {
		if (!tooltipShow) {
			dispatch(setTootipShow(true))
		}
	}

	useEffect(() => {
		tooltipOn()
		ReactTooltip.rebuild()
	})

	useEffect(() => {
		tooltipOn()
		// eslint-disable-next-line
	}, [])

	return (
		<>
			{filters !== null && filters.saved_filters.length > 0 && (
				<div className="selected-filters">
					{filters.saved_filters.map((item) => (
						<div className="selected-filters__group" key={item.alias}>
							{item.selected.map((value, index) => (
								<div
									className="selected-filters__item"
									data-tip={item.name}
									data-for="for-bottom"
									onMouseMove={tooltipOn}
									key={
										'selected-' +
										item.group +
										'-' +
										item.alias +
										'-' +
										value.alias +
										'-' +
										'223' +
										index
									}
								>
									{item.icon !== '' && (
										<Image
											src={
												REACT_APP_IMAGE_URL +
												(item.group === 'color' ? value.icon : item.icon)
											}
											alt={value.name}
											width="24px"
											height="24px"
											objectFit="cover"
										/>
									)}
									<span>{value.name}</span>
									<button
										data-group={item.group}
										data-param={item.alias}
										data-value={value.alias}
										data-item_type={'checkbox'}
										type="button"
										onClick={resetFilterValue}
									>
										&times;
									</button>
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</>
	)
}
