import { MainLayout } from '@/layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance, axiosServerInstance } from '@/store/axiosInstance'
import { REACT_APP_IMAGE_URL, serializeObj } from 'config'
import { getCookie, setCookies, checkCookies } from 'cookies-next'
import { SimpleProductsList } from '@/components/app/shop/catalog/SimpleProductsList'
import { AppDispatch, wrapper } from '@/store/store'
import { useCallback, useEffect, useState } from 'react'
import { ModulesByPlace } from '@/components/app/shop/modules/ModulesByPlace'
import { NextPage } from 'next'
import {
	TBreadcrumb,
	TModulePage,
	TModulePageResponse,
	TPageChangeHandler,
} from 'types'
import {
	listTooltipShow,
	listTranslations,
	setTootipShow,
} from '@/store/slices/globalsSlice'
import {
	listCompares,
	listComparesCount,
	listComparesPage,
	setComparesPage,
} from '@/store/slices/productsSlice'
import { CompareSlider } from '@/components/app/shop/catalog/CompareSlider'
import { CompareEmpty } from '@/components/app/shop/catalog/compare/CompareEmpty'

interface CompareProps {
	pageContents: TModulePage | null
	error?: string
}

const Compare: NextPage<CompareProps> = ({ pageContents, error = '' }) => {
	const dispatch = useDispatch<AppDispatch>()

	const [pageContent, setPageContent] = useState(pageContents)
	const [pageError, setPageError] = useState(error)

	const translations = useSelector(listTranslations)

	const compares = useSelector(listCompares)
	const comparesCount = useSelector(listComparesCount)
	const comparesPage = useSelector(listComparesPage)
	const breadcrumbs: TBreadcrumb[] = [
		{
			title: translations('CatalogCompares'),
			href: '',
		},
	]

	const tooltipShow = useSelector(listTooltipShow)

	const tooltipOn = () => {
		if (!tooltipShow) {
			dispatch(setTootipShow(true))
		}
	}

	const loadPageContent = async () => {
		const lang = getCookie('lang')
		const looked = getCookie('lookedProducts')
		try {
			const response = await axiosServerInstance.post<TModulePageResponse>(
				'/module?page=compare',
				serializeObj({ lang, params: JSON.stringify({ looked }) })
			)
			console.log('response.data', response.data)
			setPageContent(response.data.content)
		} catch (e: any) {
			setPageError(e.response.data.error)
		}
	}

	useEffect(() => {
		console.log('first load')
		tooltipOn()

		if (!pageContent && !pageError) {
			loadPageContent()
		}
		// eslint-disable-next-line
	}, [])

	if (pageError) {
		return (
			<MainLayout title={translations('CatalogCompares')} pageCode="compare">
				<h1>Error: {pageError}</h1>
			</MainLayout>
		)
	}

	return (
		<MainLayout
			title={translations('CatalogCompares')}
			page={1}
			totalPages={1}
			path="compare"
			h1={translations('CatalogCompares')}
			breadcrumbs={breadcrumbs}
			pageCode="compare"
		>
			<div id="content" className="catalog-content">
				{compares.length > 0 && <CompareSlider products={compares} />}
				{!compares.length && (
					<CompareEmpty
						link="/"
						emptyText={translations('CatalogComparesEmpty')}
					/>
				)}
			</div>
		</MainLayout>
	)
}

Compare.getInitialProps = async ({ query, req, res }) => {
	if (!req) {
		console.log('sending empty data')
		return {
			pageContents: null,
		}
	}

	//console.log('store', store)

	const lang = getCookie('lang', { req, res })
	const looked = getCookie('lookedProducts', { req, res })

	try {
		const pageResponse = await axiosServerInstance.post<TModulePageResponse>(
			'/module?page=favourite',
			serializeObj({ lang, params: JSON.stringify({ looked }) })
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

export default Compare
