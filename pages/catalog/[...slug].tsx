import { MainLayout } from '@/layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import { REACT_APP_IMAGE_URL, serializeObj } from 'config'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { ProductsList } from '@/components/app/shop/catalog/ProductsList'
import { CategoriesVertMenu } from '@/components/app/shop/catalog/CategoriesVertMenu'
import { useRouter } from 'next/router'
import isEqual from 'lodash/isEqual'
import { AppDispatch, wrapper } from '@/store/store'

import {
	listProductsItemsCount,
	fetchProductsPage,
	setProducts,
	ProductPageResponse,
	TProductListViewType,
} from '@/store/slices/productsSlice'
import {
	listCurrent,
	getFilterPath,
	fetchCategory,
	listCategoriesLoaded,
	listBreadcrumbs,
	isFiltersChanged,
	setFiltersChanged,
	setFiltersHeightChanged,
	setCategories,
	setBreadcrumbs,
	isProductFiltersChanged,
	listProductsItemsInPage,
	clearProductFiltersChanged,
	TCatalogResponse,
} from '@/store/slices/categoriesSlice'
import { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import { TModulePage, TModulePageResponse } from 'types'
import { ParsedUrlQuery } from 'querystring'

interface CategoryProps {
	serverQuery: ParsedUrlQuery
	pageContents: TModulePage | null
	error?: string
	all: string
}

const Category: NextPage<CategoryProps> = ({
	serverQuery,
	pageContents,
	error = '',
}) => {
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const [pathSlug, setpathSlug] = useState(router.query.slug)
	const [leftLoaded, setLeftLoaded] = useState(false)

	const [pageContent, setPageContent] = useState(pageContents)
	const [catalogError, setCatalogError] = useState(error)

	const currentCat = useSelector(listCurrent)
	const breadcrumbs = useSelector(listBreadcrumbs)

	const catsLoaded = useSelector(listCategoriesLoaded)

	const prodsFiltersChanged = useSelector(isProductFiltersChanged)
	const itemsInPage = useSelector(listProductsItemsInPage)

	const itemsCount = useSelector(listProductsItemsCount)
	const totalPages = Math.ceil(itemsCount / itemsInPage)

	const filterChanged = useSelector(isFiltersChanged)
	const filterPath = useSelector(getFilterPath)

	let page = 1
	if (typeof serverQuery.page === 'string') {
		page = parseInt(serverQuery.page)
	}

	const loadCats = () => {
		console.log('loading cats')
		dispatch(fetchCategory({ slug: router.query.slug }))
	}

	const loadProducts = () => {
		console.log('loading products')
		dispatch(
			fetchProductsPage({
				query: filterPath(),
			})
		)
		setTimeout(() => {
			dispatch(setFiltersHeightChanged())
		}, 100)
	}

	const loadPageContent = async () => {
		console.log('loading started...')
		const lang = getCookie('lang')
		const looked = getCookie('lookedProducts')
		try {
			const response = await axiosServerInstance.post<TModulePageResponse>(
				'/module?page=category',
				serializeObj({ lang, params: JSON.stringify({ looked }) })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
		} catch (e: any) {
			setCatalogError(e.response.data.error)
		}
	}

	useEffect(() => {
		console.log('first load')
		//dispatch(clearFiltersChanged())
		dispatch(clearProductFiltersChanged())

		if (!pageContent && !catalogError) {
			loadPageContent()
		}
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (!isEqual(pathSlug, router.query.slug)) {
			setpathSlug(router.query.slug)
			console.log('router.query.slug changed', router.query.slug)
			dispatch(setFiltersChanged())
		}
		// eslint-disable-next-line
	}, [router.query.slug])

	useEffect(() => {
		console.log('filterChanged', filterChanged)
		//filterPath()
		loadCats()
		// eslint-disable-next-line
	}, [filterChanged])

	useEffect(() => {
		if (catsLoaded && !leftLoaded) {
			setLeftLoaded(true)
		}
		// eslint-disable-next-line
	}, [catsLoaded])

	useEffect(() => {
		console.log('prodsFiltersChanged', prodsFiltersChanged)
		if (prodsFiltersChanged && leftLoaded) {
			loadProducts()
		}
		// eslint-disable-next-line
	}, [prodsFiltersChanged])

	if (catalogError) {
		return (
			<MainLayout title={'Category page'} pageCode={'category'}>
				<div className="container">
					<h1>Error: {catalogError}</h1>
				</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title={currentCat?.meta_title}
			page={page}
			totalPages={totalPages}
			path="product"
			h1={currentCat?.name}
			breadcrumbs={breadcrumbs}
      pageCode={'category'}
      pageContents={pageContent}
		>
			<div className="catalog-frame">
				<CategoriesVertMenu contentId="#content" />
				<div id="content" className="catalog-content catalog__right-content">
					<ProductsList />
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
					pageContents: null,
				}
			}

			//console.log('store', store)

			const lang = getCookie('lang', { req, res })
			const viewType = getCookie('viewType', {
				req,
				res,
			}) as TProductListViewType
			const looked = getCookie('lookedProducts', { req, res })

			try {
				const pageResponse =
					await axiosServerInstance.post<TModulePageResponse>(
						'/module?page=category',
						serializeObj({ lang, params: JSON.stringify({ looked }) })
					)

				const catalogResponse =
					await axiosServerInstance.post<TCatalogResponse>(
						'/category?' + serializeObj(query),
						serializeObj({ lang })
					)
				// console.log('response.data', catalogResponse.data)

				const productsResponse =
					await axiosServerInstance.post<ProductPageResponse>(
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
						serverViewType: viewType,
					})
				)

				return {
					serverQuery: query,
					pageContents: pageResponse.data.content,
				}
			} catch (error: any) {
				if (res) res.statusCode = 404
				return {
					serverQuery: query,
					error: error.message,
					pageContents: null,
				}
			}
		}
)

export default Category
