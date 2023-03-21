import { useDispatch, useSelector } from 'react-redux'
import {
	setProductViewType,
	ListProductViewType,
  TProductListViewType,
} from '@/store/slices/productsSlice'
import {
	listProductsSortOrder,
	listProductsItemsInPage,
	setProductSortOrder,
	setProductItemsInPage,
	setFiltersHeightChanged,
} from '@/store/slices/categoriesSlice'
import { listTranslations } from '@/store/slices/globalsSlice'
import classNames from 'classnames'
import {
	checkCookies,
	getCookie,
	removeCookies,
	setCookies,
} from 'cookies-next'
import { ChangeEvent } from 'react'
import { AppDispatch } from '@/store/store'

export const SortOrderBlock = () => {
	const dispatch = useDispatch<AppDispatch>()

	const itemsInPage = useSelector(listProductsItemsInPage)
	const sortOrder = useSelector(listProductsSortOrder)
	const viewType = useSelector(ListProductViewType)
	const translations = useSelector(listTranslations)

	const sortChange = (event: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setProductSortOrder(event.target.value))
	}

	const viewTypeChange = (type: TProductListViewType) => {
		const oldType = getCookie('viewType')
		if (oldType !== type) {
			if (checkCookies('viewType')) {
				removeCookies('viewType')
			}
			const today = new Date()
			setCookies('viewType', type, {
				expires: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7),
				sameSite: 'lax',
			})
			dispatch(setProductViewType(type))
			dispatch(setFiltersHeightChanged())
		}
	}

	const itemsInPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setProductItemsInPage(+event.target.value))
	}

	return (
		<div className="item-sort-order">
			<div className="sort-item">
				<label>Сортировка: </label>
				<select value={sortOrder} onChange={sortChange}>
					<option value={'default'}>По умолчанию</option>
					<option value={'price'}>По цене (возр.)</option>
					<option value={'-price'}>По цене (убыв.)</option>
				</select>
			</div>
			<div className="sort-item">
				<label>На странице: </label>
				<select value={itemsInPage} onChange={itemsInPageChange}>
					<option value={6}>6</option>
					<option value={12}>12</option>
					<option value={24}>24</option>
					<option value={36}>36</option>
				</select>
			</div>
			<div className="sort-item view-type-sort">
				<button
					type="button"
					onClick={() => viewTypeChange('line')}
					className={classNames('product-list__view-type', {
						active: viewType === 'line',
					})}
					data-tip={translations('AppListTypeLine')}
					data-for="for-top"
				>
					<svg
						width="24px"
						height="24px"
						viewBox="0 0 16 16"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="10%"
							y="15%"
							width="80%"
							height="20%"
							fill="currentColor"
						></rect>
						<rect
							x="10%"
							y="43%"
							width="80%"
							height="20%"
							fill="currentColor"
						></rect>
						<rect
							x="10%"
							y="70%"
							width="80%"
							height="20%"
							fill="currentColor"
						></rect>
					</svg>
				</button>
				<button
					type="button"
					onClick={() => viewTypeChange('grid2')}
					className={classNames('product-list__view-type', {
						active: viewType === 'grid2',
					})}
					data-tip={translations('AppListTypeGrid2')}
					data-for="for-top"
				>
					<svg
						width="24px"
						height="24px"
						viewBox="-32 0 512 512"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M64 96L200 96 200 232 64 232 64 96ZM248 96L384 96 384 232 248 232 248 96ZM64 280L200 280 200 416 64 416 64 280ZM248 280L384 280 384 416 248 416 248 280Z"
							fill="currentColor"
						/>
					</svg>
				</button>
				<button
					type="button"
					onClick={() => viewTypeChange('grid3')}
					className={classNames('product-list__view-type', {
						active: viewType === 'grid3',
					})}
					data-tip={translations('AppListTypeGrid3')}
					data-for="for-top"
				>
					<svg
						width="24px"
						height="24px"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</div>
		</div>
	)
}
