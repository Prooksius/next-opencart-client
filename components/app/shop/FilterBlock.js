import Link from 'next/link'
import Image from 'next/image'
import {
	listCurrent,
	listFilters,
	listCategoriesStatus,
	changeFilters,
	getFilterPath,
	fetchCategory,
	toggleGroup,
	isFiltersChanged,
	clearCategories,
} from '@/store/slices/categoriesSlice'
import {
	listProductsItemsCount,
	fetchProductsPage,
	setProducts,
	clearProducts,
} from '@/store/slices/productsSlice'
import { setTootipShow, listTooltipShow } from '@/store/slices/globalsSlice'
//import { Loader } from '@/components/app/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReactTooltip from 'react-tooltip'
import { Collapse } from 'react-collapse'
import { REACT_APP_IMAGE_URL, PRODUCTS_LIMIT } from 'config'
import classNames from 'classnames'

export const FilterBlock = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const tooltipShow = useSelector(listTooltipShow)

	const currentCat = useSelector(listCurrent)
	const filters = useSelector(listFilters)
	const filtersChanged = useSelector(isFiltersChanged)
	const filterPath = useSelector(getFilterPath)
	const catsStatus = useSelector(listCategoriesStatus)

	const filterChange = (event) => {
		console.log('filter manual change')
		const group_type = event.target
			.closest('li')
			.getAttribute('data-group-type')
		const value_type = event.target
			.closest('li')
			.getAttribute('data-value-type')
		const group_id = event.target.closest('li').getAttribute('data-group-id')
		const filter_id = event.target.closest('li').getAttribute('data-id')

		dispatch(
			changeFilters({
				group_type,
				group_id,
				filter_id,
				item_type: value_type === 0 ? 'checkbox' : 'checkbox',
			})
		)
	}

	const doToggleGroup = (group_id) => {
		dispatch(toggleGroup(group_id))
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

	return (
		<div className="left-filter__filters-area">
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
										data-group-type={group.type}
										data-group-id={group.filter_group_id}
										data-id={item.filter_id}
										data-value-type={group.value_type}
										onClick={filterChange}
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
