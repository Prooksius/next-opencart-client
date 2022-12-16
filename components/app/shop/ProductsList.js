import { REACT_APP_IMAGE_URL, PRODUCTS_LIMIT, serializeObj } from 'config'
import { SortOrderBlock } from '@/components/app/shop/SortOrderBlock'
import { ProductTile } from '@/components/app/shop/ProductTile'
import PaginationList, {
	HeaderSlot,
	SortSlot,
} from '@/components/app/PaginationList'
import { useDispatch, useSelector } from 'react-redux'
import { listTranslations } from '@/store/slices/globalsSlice'
import {
	listProducts,
	listProductsItemsCount,
	listProductsStatus,
	ListProductViewType,
	ListCartProductId,
	setProductIimagesItem,
	selectProductById,
	clearCartProductId,
	setShowProductOptions,
	clearShowProductOptions,
	setShowProductOptionsId,
	clearShowProductOptionsId,
	ProductOptionsShow,
	ProductOptionsId,
} from '@/store/slices/productsSlice'
import {
	listProductsPage,
	listProductsItemsInPage,
	setProductPage,
	setProductFiltersChanged,
} from '@/store/slices/categoriesSlice'
import { useRouter } from 'next/router'
import { SelectedFiltersBlock } from './SelectedFiltersBlock'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

export const ProductsList = () => {
	const dispatch = useDispatch()
	const router = useRouter()

	const translations = useSelector(listTranslations)

	const [timer, setTimer] = useState(10)
	const [handle, setHandle] = useState(null)
	const [hoverProductId, setHoverProductId] = useState(null)
	const [sliding, setSliding] = useState(false)

	const itemsList = useSelector(listProducts)

	const productById = useSelector(selectProductById)

	const listStatus = useSelector(listProductsStatus)
	const page = +useSelector(listProductsPage)
	const itemsCount = useSelector(listProductsItemsCount)
	const itemsInPage = useSelector(listProductsItemsInPage)
	const viewType = useSelector(ListProductViewType)

	const pageChangeHandler = (page) => {
		dispatch(setProductPage(page))
	}

	const decrementTimer = () => {
		setTimer((oldTimer) => (oldTimer > 0 ? oldTimer - 1 : 0))
	}

	const installTimer = () => {
		if (!handle) {
			setHandle(setInterval(decrementTimer, 100))
			setHoverProductId(null)
		}
	}

	const uninstallTimer = () => {
		if (handle) {
			clearInterval(handle)
			setHandle(null)
			setHoverProductId(null)
			setTimer(10)
			if (hoverProductId) {
				dispatch(
					setProductIimagesItem({
						id: hoverProductId,
						index: 0,
					})
				)
			}
		}
	}

	const hoverProductEnter = (item) => {
		setHoverProductId(item.id)
		setTimer(10)
	}

	const hoverProductLeave = () => {
		dispatch(
			setProductIimagesItem({
				id: hoverProductId,
				index: 0,
			})
		)
		setHoverProductId(null)
		setTimer(0)
		setSliding(false)
	}

	useEffect(() => {
		if (hoverProductId && handle && timer === 0) {
			setSliding(true)
			console.log('hoverProductId', hoverProductId)
			dispatch(
				setProductIimagesItem({
					id: hoverProductId,
					index: productById(hoverProductId)
						? productById(hoverProductId).image_item <
						  productById(hoverProductId).images.length - 1
							? productById(hoverProductId).image_item + 1
							: 0
						: 0,
				})
			)
			setTimer(10)
		}
		// eslint-disable-next-line
	}, [timer])

	useEffect(() => {
		installTimer()
		return uninstallTimer
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<PaginationList
				title={'Список товаров'}
				loadedPage={+page}
				listStatus={listStatus}
				containerClass={'notes-container'}
				listClass={'products-list'}
				itemsCount={+itemsCount}
				itemsInPage={+itemsInPage}
				getPageContent={null}
				pageChangedCallback={pageChangeHandler}
			>
				<HeaderSlot>
					<SelectedFiltersBlock />
				</HeaderSlot>
				<SortSlot>
					<SortOrderBlock />
				</SortSlot>
				<ul
					className={classNames(
						'appearing-group',
						{ 'line-view-type': viewType === 'line' },
						{ 'grid2-view-type': viewType === 'grid2' },
						{ 'grid3-view-type': viewType === 'grid3' }
					)}
				>
					{itemsList.map((item, i) => (
						<ProductTile
							product={item}
							key={item.id}
							productEnter={() => hoverProductEnter(item)}
							productLeave={hoverProductLeave}
							sliding={sliding && item.id === hoverProductId}
						/>
					))}
				</ul>
			</PaginationList>
		</>
	)
}
