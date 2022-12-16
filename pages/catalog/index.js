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

function Catalog({ serverRoots, serverBreadcrumbs, error }) {
  const dispatch = useDispatch()
	const translations = useSelector(listTranslations)
	const [roots, setRoots] = useState(serverRoots)
	const [breadcrumbs, setBreadcrumbs] = useState(serverBreadcrumbs)

	const [rootsError, setRootsError] = useState(error)

	const load = async () => {
		console.log('loading roots started...')
		const lang = getCookie('lang')
		try {
			const response = await axiosServerInstance.post(
				'/category/roots',
				serializeObj({ lang })
			)
			console.log('response.data', response.data)
			setRoots(response.data.roots)
			setBreadcrumbs(response.data.breadcrumbs)
		} catch (e) {
			setRootsError(e.response.data.error)
		}
	}

	useEffect(() => {
		if (!roots && !rootsError) {
			load()
		}
		dispatch(clearCategories())
		dispatch(clearProducts())

		// eslint-disable-next-line
	}, [])

	if (rootsError) {
		return (
			<MainLayout title={'Catalog page'}>
				<div className="container">
					<h1>Error: {rootsError}</h1>
				</div>
			</MainLayout>
		)
	}

	if (!roots) {
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
			title={translations('Catalog')}
			path="catalog"
			h1={translations('Catalog')}
			breadcrumbs={breadcrumbs}
		>
			<div className="container">
				<CategoryTiles roots={roots} />
			</div>
		</MainLayout>
	)
}

Catalog.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		return { serverRoots: null, serverBreadcrumbs: null }
	}

	try {
		const lang = getCookie('lang', { req, res })

		const response = await axiosServerInstance.post(
			'/category/roots',
			serializeObj({ lang })
		)
		console.log('response.data', response.data)

		return {
			serverRoots: response.data.roots,
			serverBreadcrumbs: response.data.breadcrumbs,
		}
	} catch (error) {
		res.statusCode = 404
		return {
			serverRoots: null,
			serverBreadcrumbs: null,
			error: error.message,
		}
	}
}

export default Catalog
