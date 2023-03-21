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
	listProductsLoaded,
	ProductPageResponse,
	TProductListViewType,
} from '@/store/slices/productsSlice'
import { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import { TBreadcrumb, TModulePage, TModulePageResponse } from 'types'
import { ParsedUrlQuery } from 'querystring'
import { listTranslations } from '@/store/slices/globalsSlice'
import {
	getFilterPath,
	isProductFiltersChanged,
	listProductsItemsInPage,
} from '@/store/slices/categoriesSlice'

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

	const translations = useSelector(listTranslations)

	const [pageContent, setPageContent] = useState(pageContents)
	const [catalogError, setCatalogError] = useState(error)

	const breadcrumbs: TBreadcrumb[] = [
		{
			title: translations('CatalogSpecials'),
			href: '',
		},
	]

	const prodsFiltersChanged = useSelector(isProductFiltersChanged)
	const itemsInPage = useSelector(listProductsItemsInPage)

	const prodsLoaded = useSelector(listProductsLoaded)
	const itemsCount = useSelector(listProductsItemsCount)
	const totalPages = Math.ceil(itemsCount / itemsInPage)

	const filterPath = useSelector(getFilterPath)

	let page = 1
	if (typeof serverQuery.page === 'string') {
		page = parseInt(serverQuery.page)
	}

	const loadProducts = () => {
		console.log('loading products')
		dispatch(
			fetchProductsPage({
        query: filterPath(),
        type: 'special'
			})
		)
	}

	const loadPageContent = async () => {
		console.log('loading started...')
		const lang = getCookie('lang')
		const looked = getCookie('lookedProducts')
		try {
			const response = await axiosServerInstance.post<TModulePageResponse>(
				'/module?page=special',
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

		if (!pageContent && !catalogError) {
			loadPageContent()
		}
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		console.log('prodsFiltersChanged', prodsFiltersChanged)
		loadProducts()
		// eslint-disable-next-line
	}, [prodsFiltersChanged])

	if (catalogError) {
		return (
			<MainLayout title="Special page" pageCode="special">
				<div className="container">
					<h1>Error: {catalogError}</h1>
				</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title="Special page"
			page={page}
			totalPages={totalPages}
			path="products/special"
			h1="Special page"
			breadcrumbs={breadcrumbs}
			pageCode={'special'}
			pageContents={pageContent}
		>
			<div id="content" className="catalog-content">
				<ProductsList />
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
						'/module?page=special',
						serializeObj({ lang, params: JSON.stringify({ looked }) })
					)

				const productsResponse =
					await axiosServerInstance.post<ProductPageResponse>(
						'/product/special-page?' + serializeObj(query),
						serializeObj({ lang })
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
