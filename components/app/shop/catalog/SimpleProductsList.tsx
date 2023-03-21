import { ProductTile } from '@/components/app/shop/product/ProductTile'
import { ListProductViewType, TProduct } from '@/store/slices/productsSlice'
import PaginationList, {
	HeaderSlot,
	SortSlot,
} from '@/components/app/shop/global/PaginationList'
import { useDispatch, useSelector } from 'react-redux'
import { listTranslations } from '@/store/slices/globalsSlice'
import { SelectedFiltersBlock } from './SelectedFiltersBlock'
import { SortOrderBlock } from './SortOrderBlock'
import { TPageChangeHandler, TStatus } from 'types'
import range from 'lodash.range'
import classNames from 'classnames'
import { ProductTilePH } from '../product/ProductTilePH'
import { AppDispatch } from '@/store/store'
import { listProductsItemsInPage } from '@/store/slices/categoriesSlice'

interface SimpleProductsListProps {
	products: TProduct[]
	productsTotal: number
	productsPage: number
	listStatus: TStatus
	isInFavourites?: boolean
	isInCompares?: boolean
	pageChange: TPageChangeHandler
}

export const SimpleProductsList = ({
	products,
	productsTotal,
	productsPage,
	listStatus,
	isInFavourites = false,
	isInCompares = false,
	pageChange,
}: SimpleProductsListProps) => {
	const viewType = useSelector(ListProductViewType)
	const itemsInPage = useSelector(listProductsItemsInPage)

	const defProducts = range(6)

	return (
		<>
			<PaginationList
				title={'Список товаров'}
				loadedPage={productsPage}
				listStatus={listStatus}
				containerClass={'notes-container'}
				listClass={'products-list'}
				itemsCount={productsTotal}
				itemsInPage={itemsInPage}
				pageChangedCallback={pageChange}
			>
				<HeaderSlot />
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
							products.map((item) => (
								<ProductTile
									product={item}
									key={item.id}
									isInFavourites={isInFavourites}
									isInCompares={isInCompares}
								/>
							))}
						{listStatus === 'loading' &&
							defProducts.map((item, index) => <ProductTilePH key={index} />)}
					</ul>
				</div>
			</PaginationList>
		</>
	)
}
