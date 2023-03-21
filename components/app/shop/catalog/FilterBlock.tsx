import Image from 'next/image'
import {
	listFilters,
	changeFilters,
	toggleGroup,
	listPricesOpen,
	togglePrice,
} from '@/store/slices/categoriesSlice'
import { setTootipShow, listTooltipShow } from '@/store/slices/globalsSlice'
//import { Loader } from '@/components/app/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Collapse } from 'react-collapse'
import { REACT_APP_IMAGE_URL, PRODUCTS_LIMIT } from 'config'
import classNames from 'classnames'
import { AppDispatch } from '@/store/store'
import { RangeSlider } from '@/components/app/misc/RangeSlider'

export const FilterBlock = () => {
	const dispatch = useDispatch<AppDispatch>()
	const tooltipShow = useSelector(listTooltipShow)

	const filters = useSelector(listFilters)
	const priceOpen = useSelector(listPricesOpen)

	const filterChange = (
		group_type: string,
		group_id: string | number,
		filter_id: number,
		value_type: number
	) => {
		console.log('filter manual change')
		dispatch(
			changeFilters({
				group_type,
				group_id,
				filter_id,
				item_type: value_type === 0 ? 'checkbox' : 'checkbox',
			})
		)
	}

	const doToggleGroup = (group_id: string | number) => {
		dispatch(toggleGroup(group_id))
	}

	const doTogglePrice = () => {
		dispatch(togglePrice())
	}

	const tooltipOn = () => {
		if (!tooltipShow) {
			dispatch(setTootipShow(true))
		}
	}

	useEffect(() => {
		tooltipOn()
		// eslint-disable-next-line
	}, [])

	if (!filters) {
		return null
	}

	return (
		<div className="left-filter__filters-area">
			{filters && (
				<>
					<h3
						className="left-filter__filter-heading"
						onClick={() => doTogglePrice()}
					>
						Цены
					</h3>
					<Collapse isOpened={priceOpen}>
						<RangeSlider />
					</Collapse>
				</>
			)}
			{filters.filter_groups.map((group) => (
				<div
					key={group.type + '-' + group.filter_group_id}
					className="left-filter__filter-block"
				>
					<h3
						className="left-filter__filter-heading"
						onClick={() => doToggleGroup(group.filter_group_id)}
					>
						<span>{group.name}</span>
						{group.icon !== '' && (
							<span
								className="filter_icon"
								data-tip={group.description}
								data-for="for-bottom"
							>
								<Image
									src={REACT_APP_IMAGE_URL + group.icon}
									alt={group.name}
									width="24px"
									height="24px"
								/>
							</span>
						)}
					</h3>
					<Collapse isOpened={group.is_open}>
						<div className="left-filter__filter-params_list">
							<ul>
								{group.filter.map((item) => (
									<li
										key={
											group.type +
											'-' +
											group.filter_group_id +
											'-' +
											item.filter_id
										}
										onClick={() =>
											filterChange(
												group.type,
												group.filter_group_id,
												item.filter_id,
												group.value_type
											)
										}
									>
										{(group.value_type === 0 || group.value_type === 2) && (
											<label className="form__checkbox">
												<span>
													{item.icon && (
														<Image
															src={REACT_APP_IMAGE_URL + item.icon}
															alt={item.name}
															width="24px"
															height="24px"
														/>
													)}
													<span className="left-filter__filter-name">
														{item.name}
													</span>
													<span
														className={classNames([
															'left-filter__my-checkbox',
															{ checked: item.is_selected },
														])}
													></span>
													<span className="left-filter__filter-num">
														({item.quantity})
													</span>
												</span>
											</label>
										)}
									</li>
								))}
							</ul>
						</div>
					</Collapse>
				</div>
			))}
		</div>
	)
}
