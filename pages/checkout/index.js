import { MainLayout } from '@/layouts/MainLayout'
import { axiosServerInstance } from '@/store/axiosInstance'
import { REACT_APP_IMAGE_URL, PRODUCTS_LIMIT, serializeObj } from '/config'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import { CategoryTiles } from '@/components/app/shop/CategoryTiles'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listTranslations } from '@/store/slices/globalsSlice'
import { LoadingPlaceholder } from '@/components/app/shop/LoadingPlaceholder'
import { clearProducts } from '@/store/slices/productsSlice'
import { clearCategories } from '@/store/slices/categoriesSlice'
import { Cart } from '@/components/app/shop/cart/Cart'
import { CartTotals } from '@/components/app/shop/cart/CartTotals'

function Checkout({ pageContents, error }) {
	const dispatch = useDispatch()
	const translations = useSelector(listTranslations)

	const [pageContent, setPageContent] = useState(pageContents)
	const [pageError, setPageError] = useState(error)

	const load = async () => {
		console.log('loading started...')
		const lang = getCookie('lang')
		const looked = getCookie('lookedProducts')
		try {
			const response = await axiosServerInstance.post(
				'/module?page=checkout',
				serializeObj({ lang, params: JSON.stringify({ looked }) })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
		} catch (e) {
			setPageError(e.response.data.message)
		}
	}

	useEffect(() => {
		if (!pageContent && !pageError) {
			console.log('loading data...')
			load()
		}
		// eslint-disable-next-line
	}, [])

	if (pageError) {
		return (
			<MainLayout title={'Checkout page'}>
				<div className="container">
					<h1>Error: {rootsError}</h1>
				</div>
			</MainLayout>
		)
	}

	if (!pageContent) {
		return (
			<MainLayout title={'Home page'}>
				<div className="container">
					<LoadingPlaceholder />
				</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title={translations('Checkout')}
			path="checkout"
			h1={translations('Checkout')}
			breadcrumbs={[{ title: translations('Checkout'), href: '' }]}
		>
			<div className="container">
				<div className="cart-frame">
					<div className="cart-main__area">
						<Cart />
					</div>
					<div className="cart-totals__sidebar">
						<CartTotals />
					</div>
				</div>
			</div>
		</MainLayout>
	)
}

Checkout.getInitialProps = async ({ store, query, req, res }) => {
	if (!req) {
		return { pageContents: null }
	}

	console.log('store', store)

	const lang = getCookie('lang', { req, res })
	const looked = getCookie('lookedProducts', { req, res })

	try {
		const pageResponse = await axiosServerInstance.post(
			'/module?page=checkout',
			serializeObj({ lang, params: JSON.stringify({ looked }) })
		)
		return {
			pageContents: pageResponse.data.content,
		}
	} catch (error) {
		res.statusCode = 404
		return {
			pageContents: null,
			error: error.message,
		}
	}
}
export default Checkout
