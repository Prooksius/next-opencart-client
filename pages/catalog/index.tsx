import { MainLayout } from '@/layouts/MainLayout'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import { serializeObj } from '@/config'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { CategoryTiles } from '@/components/app/shop/catalog/CategoryTiles'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { listTranslations } from '@/store/slices/globalsSlice'
import { LoadingPlaceholder } from '@/components/app/shop/global/LoadingPlaceholder'
import { clearProducts } from '@/store/slices/productsSlice'
import { clearCategories, TCategory } from '@/store/slices/categoriesSlice'
import { TBreadcrumb } from 'types'
import { NextPage } from 'next'

interface CatalogProps {
	serverRoots: TCategory[] | null
	serverBreadcrumbs: TBreadcrumb[] | null
	error?: string
}

interface TRootsResponse {
	success: number
	breadcrumbs: TBreadcrumb[] | null
	roots: TCategory[] | null
}

const Catalog: NextPage<CatalogProps> = ({
	serverRoots,
	serverBreadcrumbs,
	error,
}: CatalogProps) => {
	const translations = useSelector(listTranslations)
	const [roots, setRoots] = useState(serverRoots)
	const [breadcrumbs, setBreadcrumbs] = useState(serverBreadcrumbs)

	const [rootsError, setRootsError] = useState(error)

	const load = async () => {
		const lang = getCookie('lang')
		try {
			const response = await axiosServerInstance.post<TRootsResponse>(
				'/category/roots',
				serializeObj({ lang })
			)
			console.log('response.data', response.data)
			setRoots(response.data.roots)
			setBreadcrumbs(response.data.breadcrumbs)
		} catch (e: any) {
			setRootsError(e.response.data.error)
		}
	}

	useEffect(() => {
		if (!roots && !rootsError) {
			load()
		}
		// eslint-disable-next-line
	}, [])

	if (rootsError) {
		return (
			<MainLayout title={'Catalog page'} pageCode={'catalog'}>
				<div className="container">
					<h1>Error: {rootsError}</h1>
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
			pageCode={'catalog'}
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

		const response = await axiosServerInstance.post<TRootsResponse>(
			'/category/roots',
			serializeObj({ lang })
		)
		console.log('response.data', response.data)

		return {
			serverRoots: response.data.roots,
			serverBreadcrumbs: response.data.breadcrumbs,
		}
	} catch (error: any) {
		if (res) res.statusCode = 404
		return {
			serverRoots: null,
			serverBreadcrumbs: null,
			error: error.message,
		}
	}
}

export default Catalog
