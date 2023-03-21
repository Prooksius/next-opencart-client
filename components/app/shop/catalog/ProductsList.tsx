import { SortOrderBlock } from '@/components/app/shop/catalog/SortOrderBlock'
import { ProductTile } from '@/components/app/shop/product/ProductTile'
import PaginationList, {
	HeaderSlot,
	SortSlot,
} from '@/components/app/shop/global/PaginationList'
import { useDispatch, useSelector } from 'react-redux'
import { listTranslations } from '@/store/slices/globalsSlice'
import {
	listProducts,
	listProductsItemsCount,
	listProductsStatus,
	ListProductViewType,
	TProductListViewType,
} from '@/store/slices/productsSlice'
import {
	listProductsPage,
	listProductsItemsInPage,
	setProductPage,
} from '@/store/slices/categoriesSlice'
import { SelectedFiltersBlock } from './SelectedFiltersBlock'
import classNames from 'classnames'
import range from 'lodash.range'
import { ProductTilePH } from '../product/ProductTilePH'
import { TPageChangeHandler } from 'types'
import { AppDispatch } from '@/store/store'
import { SimpleProductsList } from './SimpleProductsList'

export const ProductsList = () => {
	const dispatch = useDispatch<AppDispatch>()

	const translations = useSelector(listTranslations)

	const itemsList = useSelector(listProducts)

	const listStatus = useSelector(listProductsStatus)
	const page = useSelector(listProductsPage)
	const itemsCount = useSelector(listProductsItemsCount)
	const itemsInPage = useSelector(listProductsItemsInPage)
	const viewType = useSelector(ListProductViewType)

	const defProducts = range(6)

	const pageChangeHandler: TPageChangeHandler = (page) => {
		dispatch(setProductPage(page))
	}

	return (
		<>
			<PaginationList
				title={'Список товаров'}
				loadedPage={page}
				listStatus={listStatus}
				containerClass={'notes-container'}
				listClass={'products-list'}
				itemsCount={itemsCount}
				itemsInPage={itemsInPage}
				pageChangedCallback={pageChangeHandler}
			>
				<HeaderSlot>
					<SelectedFiltersBlock />
				</HeaderSlot>
				<SortSlot>
					<SortOrderBlock />
				</SortSlot>
				<div
					className={classNames(
						'view-type-container',
						{ 'line-view-type': viewType === 'line' },
						{ 'grid2-view-type': viewType === 'grid2' },
						{ 'grid3-view-type': viewType === 'grid3' }
					)}
				>
					<ul>
						{listStatus === 'succeeded' &&
							itemsList.map((item) => (
								<ProductTile product={item} key={item.id} />
							))}
						{listStatus === 'loading' &&
							defProducts.map((item, index) => <ProductTilePH key={index} />)}
					</ul>
				</div>
			</PaginationList>
		</>
	)
}
