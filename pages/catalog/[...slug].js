import { MainLayout } from '@/layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { axiosServerInstance } from '@/store/axiosInstance'
import { REACT_APP_IMAGE_URL, serializeObj } from 'config'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { ProductsList } from '@/components/app/shop/ProductsList'
import { CategoriesVertMenu } from '@/components/app/shop/CategoriesVertMenu'
import { useRouter } from 'next/router'
import isEqual from 'lodash/isEqual'
import debounce from 'lodash.debounce'
import { wrapper } from '@/store/store'

import {
	listProductsItemsCount,
	fetchProductsPage,
	setProducts,
	listProducts,
	listProductsLoaded,
	clearProducts,
	setProductViewType,
} from '@/store/slices/productsSlice'
import {
	listCurrent,
	listFilters,
	getFilterPath,
	fetchCategory,
	listCategoriesLoaded,
	listRequestQuery,
	listBreadcrumbs,
	isFiltersChanged,
	clearFilterChanged,
	clearCategories,
	setRequestQuery,
	setFiltersHeightChanged,
	clearFiltersHeightChanged,
	setCategories,
	setBreadcrumbs,
	isProductFiltersChanged,
	listProductsSortOrder,
	listProductsItemsInPage,
  clearProductFiltersChanged,
} from '@/store/slices/categoriesSlice'
import { useCallback, useEffect, useState } from 'react'
import { LoadingPlaceholder } from '@/components/app/shop/LoadingPlaceholder'

let handle = null

function Category({ serverQuery, serverViewType, error }) {
	const dispatch = useDispatch()
	const router = useRouter()
	const [handle, setHandle] = useState(null)
	const [timer, setTimer] = useState(0)
	const [pathSlug, setpathSlug] = useState(null)

	const [catalogError, setCatalogError] = useState(error)

	const clientBreadcrumbs = useSelector(listBreadcrumbs)
	const currentCat = useSelector(listCurrent)

	const catsLoaded = useSelector(listCategoriesLoaded)

	const prodsFiltersChanged = useSelector(isProductFiltersChanged)
	const savedRequestQuery = useSelector(listRequestQuery)
	const sortOrder = useSelector(listProductsSortOrder)
	const itemsInPage = useSelector(listProductsItemsInPage)

	const clientList = useSelector(listProducts)
	const prodsLoaded = useSelector(listProductsLoaded)
	const itemsCount = useSelector(listProductsItemsCount)
	const totalPages = Math.ceil(itemsCount / itemsInPage)

	const filterChanged = useSelector(isFiltersChanged)
	const filterPath = useSelector(getFilterPath)

	const loadCats = async (onlyCats = false) => {
		console.log('loading cats')
		await dispatch(
			fetchCategory({
				query: filterPath(),
			})
		)
		if (!onlyCats) {
			if (!prodsLoaded) {
				await loadProducts()
				return
			}
			console.log('setting timer 10')
			debouncedloadProds()
		}
	}

	const loadProducts = async () => {
		dispatch(
			fetchProductsPage({
				query: filterPath(),
			})
		)
		dispatch(setFiltersHeightChanged())
	}

	// eslint-disable-next-line
	const debouncedloadCats = useCallback(
		debounce((onlyCats) => loadCats(onlyCats), 800),
		[filterChanged]
	)

	// eslint-disable-next-line
	const debouncedloadProds = useCallback(
		debounce(() => loadProducts(), 300),
		[filterChanged]
	)

	const decrementTimer = () => {
		setTimer((oldTimer) => (oldTimer > 0 ? oldTimer - 1 : 0))
	}

	const installTimer = () => {
		if (!handle) setHandle(setInterval(decrementTimer, 100))
	}

	const uninstallTimer = () => {
		if (handle) {
			clearInterval(handle)
			setHandle(null)
			dispatch(clearCategories())
			dispatch(clearProducts())
		}
	}

	useEffect(() => {
		if (handle && timer === 1) {
			setTimer(0)
			console.log('loading products')
			loadProducts()
		}
		// eslint-disable-next-line
	}, [timer])

	useEffect(() => {
		console.log('installTimer')
		//		installTimer()
		//		return uninstallTimer
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (!isEqual(pathSlug, router.query.slug)) {
			setpathSlug(router.query.slug)
		}
		// eslint-disable-next-line
	}, [router.asPath])

	useEffect(() => {
		if (pathSlug) {
			console.log('pathSlug Changed')
			debouncedloadCats(true)
		}
		// eslint-disable-next-line
	}, [pathSlug])

	useEffect(() => {
		if (!isEqual({}, savedRequestQuery)) {
			console.log('savedRequestQuery changed: ', savedRequestQuery)
			if (!prodsLoaded) {
				loadProducts()
				return
			}
			debouncedloadProds()
		}
		// eslint-disable-next-line
	}, [savedRequestQuery])

	useEffect(() => {
		//		if (filterChanged) {
		//dispatch(clearFilterChanged())
		console.log('loading cats...filterChanged')
		//		}
		debouncedloadCats(true)
		return debouncedloadCats.cancel
		// eslint-disable-next-line
	}, [filterChanged])

	useEffect(() => {
		if (prodsFiltersChanged) {
			filterPath()
			dispatch(clearProductFiltersChanged())
			//			dispatch(setRequestQuery(router.query))
			console.log('loading prods...prodsFiltersChanged')
			loadProducts()
		}
		// eslint-disable-next-line
	}, [prodsFiltersChanged])

	if (catalogError) {
		return (
			<MainLayout title={'Product page'}>
				<div className="container">
					<h1>Error: {catalogError}</h1>
				</div>
			</MainLayout>
		)
	}

	if (!catsLoaded) {
		return (
			<MainLayout title={'Catalog page'}>
				<div className="container">
					<LoadingPlaceholder />
				</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title={currentCat?.meta_title}
			page={serverQuery.page || 1}
			totalPages={totalPages}
			path="product"
			h1={currentCat?.name}
			breadcrumbs={clientBreadcrumbs}
		>
			<div className="container">
				<div className="catalog-frame">
					<CategoriesVertMenu contentId="#content" />
					<div id="content" className="catalog__right-content">
						<ProductsList />
					</div>
				</div>
			</div>
		</MainLayout>
	)
}

Category.getInitialProps = wrapper.getInitialPageProps(
	(store) =>
		async ({ query, req, res }) => {
			if (!req) {
				console.log('sending empty data')
				return {
					serverQuery: query,
				}
			}

			//console.log('store', store)

			const lang = getCookie('lang', { req, res })
			const viewType = getCookie('viewType', { req, res })

			try {
				const catalogResponse = await axiosServerInstance.post(
					'/category?' + serializeObj(query),
					serializeObj({ lang })
				)
				// console.log('response.data', catalogResponse.data)

				const productsResponse = await axiosServerInstance.post(
					'/product/page?' + serializeObj(query),
					serializeObj({ lang })
				)
				// console.log('response.data', productsResponse.data)
				//	console.log('products', productsResponse.data.products.list)

        console.log('settng real data')
        
        store.dispatch(setBreadcrumbs(catalogResponse.data.breadcrumbs))
        store.dispatch(
					setCategories({
						catalog: catalogResponse.data.catalog,
						query,
					})
				)
        store.dispatch(
					setProducts({
						products: productsResponse.data.products,
						query,
						serverViewType: viewType,
					})
				)

				return {
					serverQuery: query,
					serverViewType: viewType,
				}
			} catch (error) {
				res.statusCode = 404
				return {
					serverQuery: query,
					error: error.message,
				}
			}
		}
)

export default Category
