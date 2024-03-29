import { useDispatch, useSelector } from 'react-redux'
import { listTranslations } from '@/store/slices/globalsSlice'
import {
	listSortOrder,
	listItemsInPage,
	setItemsInPage,
	setSortOrder,
} from '@/store/slices/blogSlice'
import { ChangeEvent } from 'react'
import { AppDispatch } from '@/store/store'

export const SortOrderBlog = () => {
	const dispatch = useDispatch<AppDispatch>()
	const translations = useSelector(listTranslations)

	const itemsInPage = useSelector(listItemsInPage)
	const sortOrder = useSelector(listSortOrder)

	const sortChange = (event: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSortOrder(event.target.value))
	}

	const itemsInPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setItemsInPage(+event.target.value))
	}

	return (
		<div className="item-sort-order">
			<div className="sort-item">
				<label>Сортировка: </label>
				<select value={sortOrder} onChange={sortChange}>
					<option value={'default'}>По умолчанию</option>
					<option value={'popularity'}>По популярности (возр.)</option>
				</select>
			</div>
			<div className="sort-item">
				<label>На странице: {itemsInPage} </label>
				<select value={itemsInPage} onChange={itemsInPageChange}>
					<option value={3}>3</option>
					<option value={6}>6</option>
					<option value={12}>12</option>
					<option value={24}>24</option>
					<option value={36}>36</option>
				</select>
			</div>
		</div>
	)
}
